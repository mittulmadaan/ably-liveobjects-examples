# 🚀 Ably LiveObjects Examples

This repository contains interactive examples showcasing how to use **Ably LiveObjects** to build real-time collaborative applications using `LiveCounter`, `LiveMap`, and other LiveObject data types.

LiveObjects simplifies the complexity of state synchronization across clients by handling real-time updates, conflict resolution, and durability out of the box.

## 🎰 Ably LiveObjects Jackpot Betting Game

A real-time demo showcasing how to build a collaborative betting game using **Ably LiveObjects**, powered by:

- `🔢 LiveCounter` for tracking the jackpot pool
- `🗺️ LiveMap` for managing a live leaderboard

Try the live demo 👉 **[Try the demo](https://ably-liveobjects-examples.onrender.com/)**

---

## 🧠 What is LiveObjects?

[Ably LiveObjects](https://ably.com/docs/liveobjects) is a high-level abstraction over Ably's real-time messaging system, designed to simplify the management of **shared state** across multiple clients. With LiveObjects, you don’t need to manage synchronization logic manually—Ably handles that for you.

---

### 🎮 What This Demo Does

This interactive betting game demonstrates how to:

- ✅ Track and update a **jackpot pool** using `LiveCounter`
- 🏆 Show a **real-time leaderboard** using `LiveMap`
- 👤 Allow users to **join the game** and place bets
- 🔄 Let an admin **reset the game state** for all clients

All updates are propagated instantly across all connected clients using Ably’s global pub/sub infrastructure.
---

## 🔧 API Reference

You can interact with a `LiveCounter` using the following methods:

| Method | Description |
|--------|-------------|
| [`objects.getRoot()`](https://ably.com/docs/liveobjects/concepts/objects#root-object) | Retrieves the root LiveObject container. |
| [`objects.createCounter()`](https://ably.com/docs/liveobjects/counter#create) | Creates a new LiveCounter. |
| [`liveCounter.value()`](https://ably.com/docs/liveobjects/counter#value) | Returns the current counter value. |
| [`liveCounter.increment()`](https://ably.com/docs/liveobjects/counter#update) | Increments the counter value. |
| [`liveCounter.decrement()`](https://ably.com/docs/liveobjects/counter#update) | Decrements the counter value. |
| [`liveCounter.subscribe()`](https://ably.com/docs/liveobjects/counter#subscribe-data) | Subscribes to updates to the counter. |

📚 [View the full LiveCounter documentation →](https://ably.com/docs/liveobjects/counter)

---

## 🚀 Getting Started

Follow these steps to run the example locally:

### 1. Clone the repository

```bash
git clone https://github.com/mittulmadaan/ably-liveobjects-examples.git
```

### 2. Set up your environment variables

Rename the example environment file:

```bash
mv .env.example .env.local
```

Then, open `.env.local` and set your **Ably API key**:

```env
VITE_ABLY_KEY=your-ably-api-key
```

### 3. Install dependencies

```bash
yarn install
```

### 4. Start the development server

```bash
yarn run liveobjects-betting-game-javascript
```

### 5. Open the app in your browser

Visit [http://localhost:5173](http://localhost:5173) in two tabs to see LiveObject in action.

---

---
