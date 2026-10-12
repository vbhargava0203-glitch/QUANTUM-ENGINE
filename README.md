# Quantum Geometry & Control Engine

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=111)
![Dependencies](https://img.shields.io/badge/runtime_dependencies-0-38BDF8)
![Quantum system](https://img.shields.io/badge/quantum_system-single_qubit-8B5CF6)
![Status](https://img.shields.io/badge/status-interactive_simulator-22C55E)

An interactive, dependency-free laboratory for exploring **single-qubit geometry, dynamics, noise, measurement, and control** directly in the browser.

The engine turns the mathematics of the Bloch sphere into an inspectable simulation: define an initial and target state, construct a control Hamiltonian, evolve the qubit, apply noise, optimize the control parameters, and analyze the resulting trajectory—all without a framework, build step, backend, or cloud service.

> **Scientific scope:** this is an educational numerical simulator, not a connection to quantum hardware and not a claim of experimental quantum advantage. All quantities are computed locally in normalized simulation units with `ℏ = 1`.

## Highlights

- **Interactive Bloch sphere** with initial, target, current, baseline, and optimized trajectories
- **Exact single-qubit evolution** under constant or piecewise-constant Hamiltonians
- **State preparation** using Bloch angles, common state presets, and X/Y/Z/H gates
- **Pulse-program editor** with three independently configurable control segments
- **Noise channels** including bit flip, phase flip, depolarization, and dephasing
- **Mixed-state analysis** using density matrices, purity, entropy, and fidelity
- **Geometry-aware optimization** with a transparent deterministic coordinate search
- **Control landscape** sweep over pulse amplitude and duration
- **Measurement sampler** for X, Y, and Z bases with configurable shot counts
- **Live analysis charts** for fidelity, state distance, control amplitude, optimization cost, and noise response
- **Experiment notebook** backed by browser `localStorage`
- **Reproducible exports** in JSON and CSV formats
- **No runtime dependencies**—just HTML, CSS, and modern JavaScript

## Quick start

### Option 1: open directly

Clone the repository and open `index.html` in a modern browser.

```bash
git clone https://github.com/vbhargava0203-glitch/QUANTUM-ENGINE.git
cd QUANTUM-ENGINE
```

### Option 2: use a local server

Serving the folder locally gives the most consistent browser behavior:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

No package installation, API key, account, or build command is required.

## Typical workflow

1. Choose the initial and target qubit states.
2. Set the control amplitude, detuning, phase, and duration.
3. Optionally enable a piecewise pulse program or a noise model.
4. Run the simulation and inspect the trajectory on the Bloch sphere.
5. Use **Geometry Optimize** to search for improved control parameters.
6. Explore the control landscape or sample projective measurements.
7. Save the experiment locally or export the results for further analysis.

## Mathematical model

### Pure-state representation

The input qubit is parameterized by Bloch-sphere angles:

```text
|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩
```

Its Bloch vector is

```text
r = (sin θ cos φ, sin θ sin φ, cos θ).
```

### Controlled evolution

The simulator uses the Hamiltonian

```text
H = 1/2 (hₓX + hᵧY + h_zZ),
```

where amplitude and phase define the transverse field and detuning defines the effective Z component. Constant-field evolution is evaluated as the corresponding exact rotation of the Bloch vector. A pulse program composes these rotations segment by segment.

### Geometry and fidelity

For pure states, the interface reports the Fubini–Study separation

```text
d_FS(|ψ⟩, |φ⟩) = arccos(|⟨ψ|φ⟩|).
```

After a noise channel, the final state may be mixed. The engine then calculates target fidelity from the density matrix and reports the endpoint angle as

```text
d = arccos(√F).
```

It also reports

```text
Purity:  Tr(ρ²)
Entropy: S(ρ) = −Tr(ρ log₂ρ).
```

## Optimization

The optimizer is deliberately understandable rather than opaque. It uses an analytically motivated initial rotation axis followed by deterministic coordinate search over the control parameters. Available objectives emphasize:

- maximum final fidelity;
- minimum evolution time;
- minimum control energy;
- a balanced cost; or
- robustness under the selected noise model.

This makes the optimization trace reproducible and suitable for learning, demonstrations, and algorithm prototyping. It is not a hardware pulse-calibration routine.

## Project structure

```text
QUANTUM-ENGINE/
├── index.html                     # Application shell and laboratory controls
├── styles.css                     # Responsive scientific interface
└── src/
    ├── app.js                     # UI state, orchestration, and interactions
    ├── control/
    │   └── optimizer.js           # Geometry-seeded coordinate optimizer
    ├── core/
    │   ├── complex.js             # Complex-number operations
    │   ├── matrix.js              # Matrix helpers
    │   └── vector.js              # Vector algebra
    ├── geometry/
    │   ├── bloch.js               # Bloch-sphere conversions
    │   └── distance.js            # Quantum-state distances
    ├── quantum/
    │   ├── density.js             # Density-matrix diagnostics
    │   ├── gates.js               # Single-qubit gates
    │   └── state.js               # Qubit-state model
    ├── simulation/
    │   ├── noise.js               # Noise channels
    │   ├── simulator.js           # Time evolution and trajectories
    │   └── validation.js          # Numerical and physical checks
    ├── storage/
    │   └── experiments.js         # Local experiment persistence
    └── visualization/
        ├── blochSphere.js         # Interactive sphere renderer
        ├── charts.js              # Scientific charts
        └── landscape.js           # Control-landscape renderer
```

## Design principles

- **Transparent mathematics:** the important operations are implemented in small, readable modules.
- **Local-first:** experiments and notes remain in the browser unless explicitly exported.
- **Reproducible:** simulation inputs, outputs, and trajectories can be downloaded.
- **Honest scope:** simulated results are clearly separated from physical-hardware results.
- **Accessible experimentation:** the application runs on an ordinary modern browser.

## Browser support

The project targets current versions of Chrome, Edge, Firefox, and Safari with support for ES6 modules, Canvas, and `localStorage`.

## Limitations

- Models a single qubit only.
- Uses normalized simulation units rather than calibrated laboratory units.
- Noise models are idealized channels, not device-specific noise reconstructions.
- Optimization is local and deterministic; it does not guarantee a global optimum.
- Measurement results are sampled classically from the simulated state.
- No quantum processor, cloud quantum service, or experimental dataset is connected.

## Roadmap

- Multi-qubit state and gate support
- Open-system master-equation solvers
- Custom pulse-sequence creation
- Additional optimizers and objective functions
- Importable experiment configurations
- Automated numerical tests and benchmark cases
- Optional hardware-provider adapters with explicit simulation/hardware labeling

## Contributing

Issues, suggestions, and pull requests are welcome. For scientific changes, please describe the mathematical assumption being introduced and include a small reproducible validation case.

## License

No license has been added yet. Until one is selected, the source remains copyright-protected by default. If you intend to reuse or redistribute it, contact the repository owner first.

---

Built as an interactive exploration of how **geometry, dynamics, and optimization** meet in single-qubit control.
