#!/usr/bin/env python3
"""
Simple sample script for CI validation testing.
"""

def add(a, b):
    return a + b

if __name__ == "__main__":
    assert add(2, 3) == 5
    print("All sanity checks passed successfully!")
