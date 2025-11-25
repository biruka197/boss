<?php
header('Content-Type: application/json');

$resources = [
  [
    'title' => 'C++ reference (cppreference)',
    'level' => 'all',
    'focus' => 'Docs',
    'summary' => 'Authoritative, spec-aligned reference for language and STL with runnable examples.',
    'link' => 'https://en.cppreference.com/w/'
  ],
  [
    'title' => 'Compiler Explorer',
    'level' => 'intermediate',
    'focus' => 'Compiler insight',
    'summary' => 'Type C++ inline, view assembly, and compare optimization levels without local setup.',
    'link' => 'https://godbolt.org/'
  ],
  [
    'title' => 'C++ Core Guidelines',
    'level' => 'advanced',
    'focus' => 'Best practices',
    'summary' => 'Patterns for resource management, concurrency, and modern style curated by the ISO committee.',
    'link' => 'https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines'
  ],
  [
    'title' => 'LeetCode patterns (C++)',
    'level' => 'intermediate',
    'focus' => 'Problem solving',
    'summary' => 'Sharpen STL fluency and algorithmic thinking with C++-tagged problems.',
    'link' => 'https://leetcode.com/problemset/all/?topicSlugs=c%2B%2B'
  ],
  [
    'title' => 'High-performance computing intro',
    'level' => 'pro',
    'focus' => 'Performance',
    'summary' => 'Cache-aware patterns, value categories, move semantics, and profiling workflows for large systems.',
    'link' => 'https://hpc.llnl.gov/training/tutorials'
  ]
];

echo json_encode($resources);
