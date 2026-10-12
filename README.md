# Quantum Geometry & Control Engine

A dependency-free, local single-qubit quantum-control laboratory. It uses mathematically explicit Bloch-vector and density-matrix diagnostics, exact constant-Hamiltonian rotations, named one-qubit noise channels, a transparent coordinate-search optimizer, and browser `localStorage` for experiment history and notes.

## Advanced laboratory capabilities

- **Piecewise pulse design** — enable the pulse program to evolve the qubit through three ordered, independently configured constant-field Hamiltonian segments.
- **Mixed-state diagnostics** — each noisy endpoint reports purity `Tr(ρ²)` and von Neumann entropy, calculated from its Bloch-ball density matrix.
- **Measurement lab** — sample Z, X, or Y basis outcomes from the current simulated state, with adjustable shot count.
- **Control landscape** — compute a fidelity sweep over amplitude and duration for the chosen target and noise channel.
- **Reproducible outputs** — download the exact experiment, results, and trajectory as JSON or CSV.

## Run locally

Open `index.html` directly in a modern browser, or use a local static server for the most predictable browser behavior:

```powershell
cd C:\Users\vbhar\Documents\Codex\2026-10-08\gene\outputs\quantum-geometry-control-engine
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Scientific scope

- Implements one pure input qubit using `|ψ⟩ = cos(θ/2)|0⟩ + exp(iφ)sin(θ/2)|1⟩`.
- Evolves its Bloch vector with `H = 1/2(hx X + hy Y + hz Z)`, with `ℏ = 1` as a simulation convention. A pulse program composes this exact evolution segment by segment.
- Reports pure-state Fubini–Study angle for input/target geometry. With noise, final fidelity is calculated from the mixed Bloch state and the displayed endpoint angle is `acos(sqrt(F))`.
- The optimizer is intentionally inspectable: a deterministic coordinate search seeded by the analytic rotation axis. It is not a hardware calibration or an experimental result.

No real quantum hardware is connected. “Detuning” is the effective `Z`-field coefficient in normalized simulation units.
