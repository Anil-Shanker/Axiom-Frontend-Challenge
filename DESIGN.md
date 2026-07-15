I used the React Devtools to benchmark the re-render performance of the app when searching, and I saw that ~230/260ms of render time came from the individual rows re-rendering.

I initially examined the fake data generator, which copies the entire old array to generate the new one, but I ruled this out as a source of lag because copying an array of objects is cheap (after all, `slice()` only copies references under the hood)

Solution:
- I replaced the list component with TanStack Virtual to avoid rendering thousands of DOM nodes at once.
- I also memoized the list item component itself, so it would not re-render if the data for the row did not in fact change.

Notes:
- The fake datastream generator was left untouched because it's not a performance problem in and of itself - the computations within are cheap. The root of the problem was purely rerendering the entire list when the data changed. 

Alternatives considered:
- I briefly considered alternative approaches to virtualizing the list, but to me, virtualizing the list was the highest leverage lever to pull first because it's generally a smell to have a large, frequently changing, tree of DOM nodes without any level of virtualization.
- I did not consider alternative libraries for virtualization because TanStack has a simple implementation that is maximally type safe and solves the problem perfectly. 
- Naturally, I didn't consider approaches that would involve truncating the data, freezing it, et cetera, because those would no longer satisfy the business requirements.

Trade-offs:
- I opted for a new `style` prop on the row because this was the simplest way to ensure the styling with the virtualized list matches what was there beforehand.
- I also estimated a hard-coded pixel size for each row in order for the virtualizer to render the list as before. The downside of this is it creates a "magic" constant, but it's a small trade-off overall, and therefore worth it.


Next steps:
- Ideally, I would want to memoize the filtering and sorting functionality because as-is, this re-sorts the entire array in memory on every stream tick. This doesn't cause a UX downside currently because the data size is relatively small, but it's still not ideal (e.g., on exceptionally large data sets or slow client devices).
- However, this is tricky because, necessarily, the sorted state might change depending on the stream ticks, if, for example, the field by which you are sorting changes in value. So I treated this as out of scope for now, particularly since it isn't an immediate problem.
