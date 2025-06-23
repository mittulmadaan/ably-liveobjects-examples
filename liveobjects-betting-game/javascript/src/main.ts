import { DefaultRoot, LiveCounter, LiveMap, Realtime } from 'ably';
import Objects from 'ably/objects';
import { nanoid } from 'nanoid';

const clientId = nanoid();
let username = '';
let leaderboardMap: LiveMap<string, number>;

const client = new Realtime({
  clientId,
  key: 'eytLWA.WlG2vg:L3SlBp6FDj6KYIjzFo11Q-h6Zuxe8jMTkDTt5vBctbg',
  plugins: { Objects },
});

const channelName = 'jackpot-betting-2';
const channel = client.channels.get(channelName, {
  modes: ['OBJECT_PUBLISH', 'OBJECT_SUBSCRIBE'],
});

async function main() {
  updateConnectionStatus('📡 Connecting to Ably...');
  await channel.attach();
  updateConnectionStatus('✅ Connected to Ably');

  const objects = channel.objects;
  const root = await objects.getRoot();

  // Create or fetch leaderboard
  if (!root.get('leaderboard')) {
    await root.set('leaderboard', await channel.objects.createMap());
  }
  leaderboardMap = root.get('leaderboard') as LiveMap<string, number>;

  // Create jackpot counter
  if (!root.get('jackpot-counter')) {
    await root.set('jackpot-counter', await channel.objects.createCounter());
  }
  const jackpotCounter = root.get('jackpot-counter') as LiveCounter;
  jackpotCounter.subscribe(() => updateJackpotDisplay(jackpotCounter));

  setupUI(root, jackpotCounter);
  updateJackpotDisplay(jackpotCounter);
  updateLeaderboard();
}

function setupUI(root: LiveMap<DefaultRoot>, counter: LiveCounter) {
  const joinBtn = document.getElementById('join-game')!;
  const usernameInput = document.getElementById('username') as HTMLInputElement;
  const betControls = document.getElementById('bet-controls')!;
  const resetBtn = document.getElementById('reset-game');

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
      button.addEventListener('click', async () => {
        await counter.increment(amount);
        const current = (await leaderboardMap.get(username)) || 0;
        await leaderboardMap.set(username, current + amount);
      });
    });
  });

if (resetBtn) {
  resetBtn.addEventListener('click', async () => {
    const confirmReset = confirm('Are you sure you want to reset the game? This will clear the jackpot and leaderboard.');
    if (!confirmReset) return;

    // Decrement jackpot to 0
    const currentValue = counter.value();
    if (currentValue > 0) {
      await counter.decrement(currentValue);
    }

    // Clear leaderboard
    const keys = await leaderboardMap.keys();
    await Promise.all(keys.map((key) => leaderboardMap.remove(key)));

    updateJackpotDisplay(counter);
    renderLeaderboard();

    // Reset username and UI
    username = '';
    const formRow = document.querySelector('.form-row')!;
    formRow.innerHTML = `
      <input id="username" type="text" placeholder="Enter your username" />
      <button id="join-game">Join Game</button>
    `;

    // Hide betting buttons
    const betControls = document.getElementById('bet-controls')!;
    betControls.classList.add('hidden');

    // Rebind join button handler
    const joinBtn = document.getElementById('join-game')!;
    const usernameInput = document.getElementById('username') as HTMLInputElement;

    joinBtn.addEventListener('click', () => {
      if (!usernameInput.value.trim()) {
        alert('Please enter a username');
        return;
      }

      username = usernameInput.value.trim();

      formRow.innerHTML = `
        <div class="betting-user-label">
          🎮 Betting as 
          <strong><span class="username">${username}</span></strong>
        </div>`;

      betControls.classList.remove('hidden');

      document.querySelectorAll('.bet-button').forEach((button) => {
        const amount = parseFloat(button.getAttribute('data-amount')!);
        button.addEventListener('click', async () => {
          await counter.increment(amount);
          const current = (await leaderboardMap.get(username)) || 0;
          await leaderboardMap.set(username, current + amount);
        });
      });
    });
  });
}


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
  leaderboardMap.subscribe(() => {
    renderLeaderboard();
  });

  renderLeaderboard();
}

async function renderLeaderboard() {
  const list = document.getElementById('leaderboard-list')!;
  list.innerHTML = '';

  const entries = await leaderboardMap.entries();
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    const li = document.createElement('li');
    li.classList.add('empty');
    li.innerHTML = 'No players yet<br><span class="small">Join the game to see the leaderboard!</span>';
    list.appendChild(li);
    return;
  }

  sorted.forEach(([user, total], index) => {
    const li = document.createElement('li');
    li.textContent = `#${index + 1} ${user}: $${total.toFixed(2)}`;
    list.appendChild(li);
  });
}

main().catch(console.error);
// final