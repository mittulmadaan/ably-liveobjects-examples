import { DefaultRoot, LiveCounter, LiveMap, Realtime } from 'ably';
import Objects from 'ably/objects';
import { nanoid } from 'nanoid';

const clientId = nanoid();
let username = '';
let jackpotCounter: LiveCounter;
let leaderboardMap: LiveMap<string, number>;

const client = new Realtime({
  clientId,
  key: 'eytLWA.WlG2vg:L3SlBp6FDj6KYIjzFo11Q-h6Zuxe8jMTkDTt5vBctbg',
  plugins: { Objects },
});

const channel = client.channels.get('jackpot-betting-7', {
  modes: ['OBJECT_PUBLISH', 'OBJECT_SUBSCRIBE', 'PUBLISH', 'SUBSCRIBE'],
});

async function main() {
  updateConnectionStatus('📡 Connecting to Ably...');
  await channel.attach();
  updateConnectionStatus('✅ Connected to Ably');

  const root = await channel.objects.getRoot();

  if (!root.get('leaderboard')) {
    await root.set('leaderboard', await channel.objects.createMap());
  }
  leaderboardMap = root.get('leaderboard') as LiveMap<string, number>;

  if (!root.get('jackpot-counter')) {
    await root.set('jackpot-counter', await channel.objects.createCounter());
  }
  jackpotCounter = root.get('jackpot-counter') as LiveCounter;
  jackpotCounter.subscribe(() => updateJackpotDisplay(jackpotCounter));

  // Listen for reset messages from other clients
  channel.subscribe('game-reset', async (message) => {
    console.log('Reset message received:', message);
    
    // Don't process our own reset message
    if (message.clientId === clientId) {
      return;
    }

    // Unsubscribe from old counter
    if (jackpotCounter) {
      jackpotCounter.unsubscribe();
    }

    // Get the new counter and subscribe to it
    jackpotCounter = root.get('jackpot-counter') as LiveCounter;
    jackpotCounter.subscribe(() => updateJackpotDisplay(jackpotCounter));
    updateJackpotDisplay(jackpotCounter);

    // Reset UI for other clients
    username = '';
    const formRow = document.querySelector('.form-row')!;
    document.querySelectorAll('.bet-button').forEach(button => {
      const cloned = button.cloneNode(true);
      button.replaceWith(cloned);
    });

    formRow.innerHTML = `
      <input id="username" type="text" placeholder="Enter your username" />
      <button id="join-game">Join Game</button>
    `;
    document.getElementById('bet-controls')!.classList.add('hidden');
    bindJoinButton(root);
    
    // Re-render leaderboard
    renderLeaderboard();
  });

  setupUI(root);
  updateJackpotDisplay(jackpotCounter);
  updateLeaderboard();
}


function setupUI(root: LiveMap<DefaultRoot>) {
  const resetBtn = document.getElementById('reset-game');
  bindJoinButton(root);

  resetBtn.addEventListener('click', async () => {
  const confirmReset = confirm('Are you sure you want to reset the game? This will clear the jackpot and leaderboard.');
  if (!confirmReset) return;

  // Step 1: Remove old counter
  const oldCounter = root.get('jackpot-counter') as LiveCounter;
  if (oldCounter) {
    oldCounter.unsubscribe();
  }

  // Step 2: Create and set a new counter
  const newCounter = await channel.objects.createCounter();
  await root.set('jackpot-counter', newCounter);

  // Step 3: Fetch it from root to ensure consistency
  jackpotCounter = root.get('jackpot-counter') as LiveCounter;

  // Step 4: Subscribe again and update display
  jackpotCounter.subscribe(() => updateJackpotDisplay(jackpotCounter));
  updateJackpotDisplay(jackpotCounter);

  // Step 5: Clear leaderboard
  const keys = await leaderboardMap.keys();
  await Promise.all(keys.map((key) => leaderboardMap.remove(key)));
  renderLeaderboard();

  // Step 6: Notify all other clients about the reset
  await channel.publish('game-reset', {
    timestamp: Date.now(),
    resetBy: clientId
  });

  // Step 7: Reset UI
  username = '';
  const formRow = document.querySelector('.form-row')!;
  // Defensive reset: remove any lingering bet button event listeners
document.querySelectorAll('.bet-button').forEach(button => {
  const cloned = button.cloneNode(true);
  button.replaceWith(cloned); // removes any previous event listeners
});

  formRow.innerHTML = `
    <input id="username" type="text" placeholder="Enter your username" />
    <button id="join-game">Join Game</button>
  `;
  document.getElementById('bet-controls')!.classList.add('hidden');
  bindJoinButton(root); // rebinding after UI re-render
});

}

function bindJoinButton(root: LiveMap<DefaultRoot>) {
  const joinBtn = document.getElementById('join-game')!;
  const usernameInput = document.getElementById('username') as HTMLInputElement;
  const betControls = document.getElementById('bet-controls')!;

  joinBtn.addEventListener('click', () => {
    if (!usernameInput.value.trim()) {
      alert('Please enter a username');
      return;
    }

    username = usernameInput.value.trim();

    const formRow = joinBtn.parentElement!;
    formRow.innerHTML = `
      <div class="betting-user-label">
        🎮 Betting as 
        <strong><span class="username">${username}</span></strong>
      </div>`;

    betControls.classList.remove('hidden');

    document.querySelectorAll('.bet-button').forEach((button) => {
  const amount = parseFloat(button.getAttribute('data-amount')!);

  const cloned = button.cloneNode(true) as HTMLElement;
  button.replaceWith(cloned); // removes any previous event listeners

  cloned.addEventListener('click', async () => {
    await jackpotCounter.increment(amount);
    const current = (await leaderboardMap.get(username)) || 0;
    await leaderboardMap.set(username, current + amount);
    updateJackpotDisplay(jackpotCounter);
  });
});

  });
}

function updateJackpotDisplay(counter: LiveCounter) {
  const jackpotElement = document.getElementById('jackpot-amount')!;
  jackpotElement.textContent = `$${counter.value().toFixed(2)}`;
}

function updateConnectionStatus(status: string) {
  const statusElement = document.querySelector('.ably-status');
  if (statusElement) {
    statusElement.textContent = status;
  }
}

function updateLeaderboard() {
  leaderboardMap.subscribe(() => renderLeaderboard());
  renderLeaderboard();
}

async function renderLeaderboard() {
  const list = document.getElementById('leaderboard-list')!;
  list.innerHTML = '';

  const entries = await leaderboardMap.entries();
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    list.innerHTML = `<li class="empty">No players yet<br><span class="small">Join the game to see the leaderboard!</span></li>`;
    return;
  }

  sorted.forEach(([user, total], index) => {
    const li = document.createElement('li');
    li.textContent = `#${index + 1} ${user}: $${total.toFixed(2)}`;
    list.appendChild(li);
  });
}

main().catch(console.error);