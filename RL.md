 Reinforcement Learning (RL) Documentation for **Asana-Clone**

*(Designed to integrate an RL agent/environment into the repository at `https://github.com/Shreyasreddy2006/Asana-Clone/tree/anshal`.)*

---

# 1. Purpose & High-level Overview

**Goal.** Add an RL environment and agent that operate on the Asana-like task-management system to learn useful behaviors such as:
- automated task scheduling/prioritization,
- smart assignee recommendation,
- workflow automation (e.g., automatically move tasks when conditions hold),
- backlog grooming (prioritize or archive stale tasks).

The RL component is a simulated agent interacting with the application state (tasks, users, projects, sections) and learning a policy to maximize an objective (productivity, SLA adherence, user satisfaction proxy).

This repo already contains a production-ready full-stack Asana clone (Node/Express backend, React/Vite frontend, MongoDB, Socket.io). Use these components to provide state and to simulate interactions for the RL environment.

---

# 2. Design choices

- **Environment type:** Episodic, discrete-time environment that simulates a workspace over a day/week. Each episode simulates many timestep events (task creation, user responses, deadlines).
- **Interface:** Implement as an OpenAI Gym-compatible environment (Gym API: `reset()`, `step(action)`, `render()`, `close()`), so standard RL libraries (Stable Baselines3, RLlib, custom PyTorch/TensorFlow agents) can be used.
- **State abstraction:** Compact representation that captures essential info (task features, user workload, project deadlines) rather than full raw DB objects.
- **Action space:** Discrete or parameterized actions representing high-level decisions (assign task to user X, move task to section Y, set priority).
- **Reward:** Carefully shaped to capture desired outcomes (on-time completion, balanced workload, minimized task idle time) and penalize undesirable actions (overloading users, missed deadlines).
- **Simulation vs. Live:** Start with a simulator built from logged/hypothesized user behavior. Only after robust offline evaluation consider safe online experiments (do not deploy RL to live production without safeguards).

---

# 3. Environment specification

## 3.1 Observations (state)

At each timestep the environment returns an observation vector (example features — tune to your needs):

- Global features:
  - time-of-day / step index (int)
  - number of open tasks (int)
  - number of overdue tasks (int)
  - average completion rate for last N steps (float)

- Per-task features (for K highest-priority tasks or a fixed-size window):
  - task id (hashed/int)
  - age in hours (float)
  - priority (0-3)
  - due_in_hours (float, clipped)
  - assignee_id (one-hot index or embedding)
  - number_of_comments (int)
  - number_of_subtasks_remaining (int)
  - tags encoded (binary vector or embedding)
  - dependencies_count (int)

- Per-user features (for M users; aggregate or per-user):
  - current load (open tasks)
  - average completion time
  - roles/skills vector (one-hot)
  - last_active (hours)

Observation representation: concatenate into a fixed-size numeric vector or dict-of-arrays. Use normalization (min-max or standard scaling) for numeric fields.

## 3.2 Action space

Choose one of:

- **Discrete action space (simpler):**
  - `0`: No-op
  - `1..N`: Assign task `t_i` to user `u_j` (enumerated)
  - `N+1..`: Move task `t_i` to section `S_k`
  - `...` Set priority / set due-date / mark complete

- **Parameterized action space (recommended for complex tasks):**
  - Action = (action_type, task_index, target_user_index, param)
  - Implement via a small action-encoding scheme and map to discrete indices for the agent.

**Action constraints:** If an action is invalid (e.g., assign to nonexistent user), environment should either translate to a no-op and give a negative reward or mask invalid actions during action selection (action masking).

## 3.3 Rewards

Design rewards to promote desired behaviors. Example reward components (additive):

- `r_completion`: +1.0 for completing a task before deadline (scaled by priority).
- `r_late_penalty`: -1.0 for tasks completed after due date (scale by lateness).
- `r_assignment_balance`: +0.1 when variance of user loads decreases (encourages balanced assignment).
- `r_idle_penalty`: -0.01 for each timestep a high-priority task remains unassigned.
- `r_automation_success`: +0.5 when an agent automated workflow reduces manual work (measured as actions saved).
- `r_invalid_action`: -0.2 for invalid/illegal action.
- `r_user_satisfaction_proxy`: based on simulated user acceptance (e.g., if an assignee accepts a recommended assignment: +0.2; if they reassign: -0.15).

Total reward per step = weighted sum of above. Use discount factor `gamma` typical in RL (e.g., 0.99) unless episodic short-horizon.

## 3.4 Episode & termination

- Episode length: simulate fixed number of timesteps (e.g., 96 for 24 hours at 15-minute resolution or 7 days).
- Terminate earlier if catastrophic failure (e.g., too many overdue tasks).
- At reset, initialize workspace with config (number of users, backlog size, distribution of priorities).

---

# 4. Simulated user model

The training environment should include a **user simulator** to respond to agent actions:

- **Accept/Reject assignment probability:** depends on user load and task fit (skill match).
- **Task arrival process:** Poisson process for new tasks with priority distribution.
- **Completion times:** sampled from distribution per user and priority (e.g., log-normal with user skill modifiers).
- **Noise:** simulate noisy labels and occasional random reassignments.

---

# 5. Integration points with Asana-Clone repo

- Create a new folder `rl/` at the root of the repo:
  - `rl/envs/asana_gym_env.py`
  - `rl/simulators/user_simulator.py`
  - `rl/agents/train_ppo.py`
  - `rl/configs/`
  - `rl/models/`
  - `rl/README_RL.md` (this file)

Add backend endpoints:
- `/api/rl/reset` — create a new simulated workspace
- `/api/rl/step` — execute agent action and return new state, reward, done

---

# 6. Implementation sketch (Python)

```python
import gym
from gym import spaces
import numpy as np

class AsanaEnv(gym.Env):
    def __init__(self, config):
        super().__init__()
        self.config = config
        self.observation_space = spaces.Box(low=-np.inf, high=np.inf, shape=(config['obs_dim'],), dtype=np.float32)
        self.action_space = spaces.Discrete(config['action_size'])
        self.reset()

    def reset(self):
        self.t = 0
        return np.zeros(self.observation_space.shape)

    def step(self, action):
        reward = np.random.rand()
        done = self.t >= self.config.get('episode_len', 100)
        self.t += 1
        return np.zeros(self.observation_space.shape), reward, done, {}
```

---

# 7. Agent training

- Baselines: DQN, PPO (use Stable-Baselines3 or RLlib).
- Example: `python rl/agents/train_ppo.py`
- Tune learning rate, gamma, batch size, and total steps.

---

# 8. Metrics

Track:
- Task completion rate
- Task latency
- Load balance
- Reassignment rate
- Cumulative reward
- Human feedback (if any)

---

# 9. Safety

- Keep RL in sandbox mode first.
- Never deploy automated task changes directly to real users.
- Add explainability and human approval.

---

# 10. Folder summary

```
rl/
 ├── agents/
 │   └── train_ppo.py
 ├── envs/
 │   └── asana_gym_env.py
 ├── simulators/
 │   └── user_simulator.py
 ├── configs/
 │   └── asana_config.yaml
 ├── models/
 └── README_RL.md
```

---

# 11. Example experiments

- Assignee recommendation
- Auto-prioritization
- Workflow automation

---

# 12. Future work

- Hierarchical RL
- Offline RL using logs
- Sim2Real training transfer
- Preference learning

---

# 13. Quick start

```bash
git clone https://github.com/Shreyasreddy2006/Asana-Clone.git
cd Asana-Clone/rl
pip install -r requirements.txt
python agents/train_ppo.py
```
