# 🔢 Synchronizing Numeric Values with LiveCounter

**LiveCounter** enables clients to update and synchronize numerical values in realtime using [Ably LiveObjects](https://ably.com/docs/liveobjects).

It supports atomic `increment()` and `decrement()` operations, ensuring consistency across clients when multiple users modify the value simultaneously.

Ideal use cases include:

- 🗳️ Voting systems  
- ❤️ Reaction counts  
- 🎮 Game statistics  
- 🏆 Leaderboards  
- 📊 Live metrics

LiveCounter is built on top of **Ably Pub/Sub** and benefits from its performance, reliability, and scalability.

---

## 🧠 What is LiveObjects?

[Ably LiveObjects](https://ably.com/docs/liveobjects) is a high-level abstraction over Ably's real-time messaging system, designed to simplify the management of **shared state** across multiple clients. With LiveObjects, you don’t need to manage synchronization logic manually—Ably handles that for you.

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
git clone git@github.com:ably/docs.git
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

Visit [http://localhost:5173](http://localhost:5173) in two tabs to see LiveCounter in action.

---

---
