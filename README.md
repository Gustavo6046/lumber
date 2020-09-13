# Lumber

Lumber will be a multiplayer online, real-time strategy, persistent world,
procedurally generated video game.

There is a demo showcasing some of what is implemented so far. Not all the
code is demonstrated, e.g. there are no units in the demo. Rather, the focus
of it is the game's interface, at least the browser one.

## How to Run the Demo?

First, if you do not have ParcelJS yet, install it using npm or yarn:

```
npm i -g parcel
```

or

```
yarn global add parcel
```

To view the demo in your browser, clone this repository, then in the `client/`
subfolder, serve `index.html` using Parcel. The URL of the new server will be
displayed; simply access that in your browser!

```
git clone git@github.com:Gustavo6046/lumber lumber
cd lumber/client
parcel server index.html
```