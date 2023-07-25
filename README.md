This repository includes the FileExplorerTree component for SvelteKit. It emulates a (really bare) text file system within the browser environment. Data is persisted in the IndexedDB of the browser through the Dexie js API.

It also includes a showcase that integrates FileExplorerTree inside a text editor app:

<img alt="Screencast of FileExplorerTree" src="https://github.com/DegradingGracefully/DegradingGracefully/blob/main/FileExplorerTree_screencast.gif">

### Motivation
The reason I started this project is that I needed a way to store "pseudo text files" in my browser for another app. That is impossible technically for security reasons.

### State
There is working code and one cypress test spec for one scenario.

But please note that it this codebase is not perfect. For example, performance is not optimal, as I commit the whole filesystem on every change, and search is done through the code not through db. Also the architecture of the flow of data inside the SvelteKit app should be improved.

So, if you choose to use this code you can, maybe as a starting point for your own project that needs a file explorer. But I won't be able to offer support.

The reason I've set up this GitHub account is just for showcasing some of my work to potential employers.