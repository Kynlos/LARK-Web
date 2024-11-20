import os
from pathlib import Path
from typing import Dict, List, Set

def should_ignore(path: str, ignore_patterns: Set[str]) -> bool:
    """Check if the path should be ignored based on patterns."""
    path_parts = Path(path).parts
    return any(
        any(ignore in part for part in path_parts)
        for ignore in ignore_patterns
    )

def count_lines_in_file(file_path: str) -> Dict[str, int]:
    """Count total, code, comment, and blank lines in a file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except UnicodeDecodeError:
        return {'total': 0, 'code': 0, 'comment': 0, 'blank': 0}

    total_lines = len(lines)
    blank_lines = sum(1 for line in lines if not line.strip())
    comment_lines = sum(1 for line in lines if line.strip().startswith(('//', '#', '/*', '*', '*/')))
    code_lines = total_lines - blank_lines - comment_lines

    return {
        'total': total_lines,
        'code': code_lines,
        'comment': comment_lines,
        'blank': blank_lines
    }

def get_file_extension(file_path: str) -> str:
    """Get the file extension in lowercase."""
    return os.path.splitext(file_path)[1].lower()

def main():
    # Directories and files to ignore
    ignore_patterns = {
        'node_modules', '.git', 'dist', 'build', '__pycache__',
        '.DS_Store', '.env', '.vscode', 'coverage'
    }

    # File extensions to count
    count_extensions = {
        '.ts', '.tsx', '.js', '.jsx', '.py', '.css', '.scss',
        '.html', '.md', '.json', '.yml', '.yaml'
    }

    # Initialize counters
    total_stats = {ext: {'total': 0, 'code': 0, 'comment': 0, 'blank': 0} 
                  for ext in count_extensions}
    file_count = {ext: 0 for ext in count_extensions}

    # Walk through all directories
    root_dir = os.path.dirname(os.path.abspath(__file__))
    
    for root, dirs, files in os.walk(root_dir):
        # Skip ignored directories
        if should_ignore(root, ignore_patterns):
            continue

        for file in files:
            file_path = os.path.join(root, file)
            ext = get_file_extension(file_path)

            if ext not in count_extensions:
                continue

            # Count lines in file
            stats = count_lines_in_file(file_path)
            file_count[ext] += 1

            # Update totals
            for key in stats:
                total_stats[ext][key] += stats[key]

    # Print results
    print("\nCode Statistics by File Type:")
    print("-" * 80)
    print(f"{'Extension':<10} {'Files':<8} {'Total':<8} {'Code':<8} {'Comment':<8} {'Blank':<8}")
    print("-" * 80)

    grand_total = {'files': 0, 'total': 0, 'code': 0, 'comment': 0, 'blank': 0}

    for ext in sorted(count_extensions):
        if file_count[ext] > 0:
            stats = total_stats[ext]
            print(f"{ext:<10} {file_count[ext]:<8} {stats['total']:<8} {stats['code']:<8} "
                  f"{stats['comment']:<8} {stats['blank']:<8}")
            
            # Update grand totals
            grand_total['files'] += file_count[ext]
            for key in ['total', 'code', 'comment', 'blank']:
                grand_total[key] += stats[key]

    print("-" * 80)
    print(f"{'TOTAL':<10} {grand_total['files']:<8} {grand_total['total']:<8} "
          f"{grand_total['code']:<8} {grand_total['comment']:<8} {grand_total['blank']:<8}")

if __name__ == '__main__':
    main()
