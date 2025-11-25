const moduleList = [
  {
    title: "C++ foundations",
    level: "beginner",
    outcomes: ["Toolchain setup", "Types, control flow", "I/O and basic functions"],
    snippet: `#include <iostream>\n\nint main() {\n  std::cout << "Hello, path to C++ mastery!\\n";\n  return 0;\n}`,
    inline: "Practice with std::cin/std::cout, loops, and functions until they feel instant.",
  },
  {
    title: "Memory & RAII",
    level: "intermediate",
    outcomes: ["Stack vs heap", "RAII discipline", "Smart pointers"],
    snippet: `#include <memory>\n#include <iostream>\n\nstruct Logger {\n  Logger() { std::cout << "open\\n"; }\n  ~Logger() { std::cout << "close\\n"; }\n};\n\nint main() {\n  auto guard = std::make_unique<Logger>();\n  return 0;\n}`,
    inline: "Prefer std::unique_ptr for ownership, std::shared_ptr only when lifetimes must be shared.",
  },
  {
    title: "Modern C++ features",
    level: "advanced",
    outcomes: ["auto & range-for", "constexpr", "structured bindings"],
    snippet: `#include <array>\n#include <iostream>\n\nconstexpr int square(int x) { return x * x; }\n\nint main() {\n  std::array<int, 3> data{1, 2, 3};\n  for (auto [i, val] : {std::pair{0, data[0]}, {1, data[1]}, {2, data[2]}}) {\n    std::cout << i << ": " << square(val) << '\\n';\n  }\n}`,
    inline: "Write constexpr helpers first; upgrade to runtime only if necessary.",
  },
  {
    title: "Templates & STL mastery",
    level: "advanced",
    outcomes: ["STL algorithms", "Concepts", "Ranges"],
    snippet: `#include <algorithm>\n#include <iostream>\n#include <vector>\n\nint main() {\n  std::vector<int> nums{1, 3, 5, 6, 8};\n  auto even = [](int v){ return v % 2 == 0; };\n  std::vector<int> out;\n  std::copy_if(nums.begin(), nums.end(), std::back_inserter(out), even);\n  for (int v : out) std::cout << v << ' ';\n}`,
    inline: "Reach for <algorithm> and <ranges> before hand-rolled loops.",
  },
  {
    title: "Concurrency & performance",
    level: "pro",
    outcomes: ["Threads & tasks", "Atomics", "Profiling"],
    snippet: `#include <future>\n#include <iostream>\n\nint heavy(int x) { return x * x; }\n\nint main() {\n  auto a = std::async(std::launch::async, heavy, 5);\n  auto b = std::async(std::launch::async, heavy, 7);\n  std::cout << a.get() + b.get();\n}`,
    inline: "Profile before optimizing; prefer std::async, std::jthread, and span for safe speed.",
  },
];

const patterns = [
  {
    title: "Minimal class with rule of five",
    level: "intermediate",
    snippet: `class Buffer {\n public:\n  explicit Buffer(size_t n) : n_(n), data_(new int[n]{}) {}\n  ~Buffer() { delete[] data_; }\n  Buffer(const Buffer& other) : Buffer(other.n_) { std::copy(other.data_, other.data_ + n_, data_); }\n  Buffer(Buffer&& other) noexcept : n_(other.n_), data_(std::exchange(other.data_, nullptr)) {}\n  Buffer& operator=(Buffer other) noexcept { swap(*this, other); return *this; }\n  friend void swap(Buffer& a, Buffer& b) noexcept { std::swap(a.n_, b.n_); std::swap(a.data_, b.data_); }\n private:\n  size_t n_;\n  int* data_;\n};`,
    hint: "Shows copy, move, and strong exception safety via copy-swap.",
  },
  {
    title: "RAII guard for timing",
    level: "advanced",
    snippet: `#include <chrono>\n#include <iostream>\n\nstruct ScopedTimer {\n  ScopedTimer(const char* label) : label(label), start(std::chrono::steady_clock::now()) {}\n  ~ScopedTimer() {\n    const auto end = std::chrono::steady_clock::now();\n    std::chrono::duration<double, std::milli> ms = end - start;\n    std::cout << label << ": " << ms.count() << " ms\\n";\n  }\n  const char* label;\n  std::chrono::steady_clock::time_point start;\n};\n\nint main() {\n  ScopedTimer timer{"render"};\n  // work\n}`,
    hint: "Use RAII to automate profiling blocks across the codebase.",
  },
  {
    title: "Strong enums with switch",
    level: "beginner",
    snippet: `#include <iostream>\n\nenum class Color { Red, Green, Blue };\n\nint main() {\n  Color c = Color::Green;\n  switch (c) {\n    case Color::Red: std::cout << "Red"; break;\n    case Color::Green: std::cout << "Green"; break;\n    case Color::Blue: std::cout << "Blue"; break;\n  }\n}`,
    hint: "Scoped enums prevent implicit int conversions and namespace clashes.",
  },
  {
    title: "Ranges pipeline",
    level: "advanced",
    snippet: `#include <iostream>\n#include <ranges>\n#include <vector>\n\nint main() {\n  std::vector<int> nums{1,2,3,4,5,6};\n  auto even_squares = nums | std::views::filter([](int v){ return v % 2 == 0; })\n                           | std::views::transform([](int v){ return v * v; });\n  for (int v : even_squares) std::cout << v << ' ';\n}`,
    hint: "Express transformations declaratively and keep iterators implicit.",
  },
];

const resourceList = document.getElementById('resource-list');
const moduleGrid = document.getElementById('modules');
const patternGrid = document.getElementById('patterns');

function renderCode(text) {
  const block = document.createElement('pre');
  block.className = 'code-block';
  block.innerHTML = `<button class="copy">Copy</button><code>${text.replace(/</g, '&lt;')}</code>`;
  block.querySelector('button.copy').addEventListener('click', () => {
    navigator.clipboard.writeText(text);
    const btn = block.querySelector('button.copy');
    const prev = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => (btn.textContent = prev), 1200);
  });
  return block;
}

function renderModules(level = 'all') {
  moduleGrid.innerHTML = '';
  moduleList
    .filter((m) => level === 'all' || m.level === level)
    .forEach((m) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="flex" style="justify-content: space-between; align-items: center;">
          <h3 style="margin:0;">${m.title}</h3>
          <span class="badge">${m.level}</span>
        </div>
        <p class="muted">${m.inline}</p>
        <div class="flex" style="margin: 10px 0;">
          ${m.outcomes.map((o) => `<span class="pill">${o}</span>`).join('')}
        </div>
      `;
      card.appendChild(renderCode(m.snippet));
      moduleGrid.appendChild(card);
    });
}

function renderPatterns() {
  patterns.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="flex" style="justify-content: space-between; align-items: center;">
        <h3 style="margin:0;">${p.title}</h3>
        <span class="badge">${p.level}</span>
      </div>
      <p class="muted">${p.hint}</p>
    `;
    card.appendChild(renderCode(p.snippet));
    patternGrid.appendChild(card);
  });
}

async function loadResources() {
  try {
    const res = await fetch('resources.php');
    const data = await res.json();
    resourceList.innerHTML = '';
    data.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="flex" style="justify-content: space-between; align-items: center;">
          <h3 style="margin:0;">${item.title}</h3>
          <span class="badge">${item.level}</span>
        </div>
        <p class="muted">${item.summary}</p>
        <div class="flex" style="margin-top: 8px;">
          <a class="pill" href="${item.link}" target="_blank" rel="noopener">Visit</a>
          <span class="pill">Focus: ${item.focus}</span>
        </div>
      `;
      resourceList.appendChild(card);
    });
  } catch (err) {
    resourceList.innerHTML = `<div class="card">Unable to load resources: ${err}</div>`;
  }
}

function wireFilters() {
  document.querySelectorAll('.filters button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const level = btn.dataset.level;
      renderModules(level);
    });
  });
}

renderModules();
renderPatterns();
wireFilters();
loadResources();
