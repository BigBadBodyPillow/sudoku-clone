import { describe, it, expect } from 'vitest';
import {
  type Grid,
  generateCompletedGrid,
  solveGrid,
  makePuzzle,
  isValidMove,
  cloneGrid,
  createEmptyNotesGrid,
} from '../sudoku';
import {
  emptyGrid,
  sampleCompletedGrid,
  samplePuzzleGrid,
  invalidGrid,
} from '../../test/test-data';

describe('Sudoku Utils', () => {
  describe('generateCompletedGrid', () => {
    it('should generate a valid completed Sudoku grid', () => {
      const grid = generateCompletedGrid();

      // check grid dimensions
      expect(grid).toHaveLength(9);
      expect(grid[0]).toHaveLength(9);

      // check all cells are filled (no zeros)
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          expect(grid[row][col]).toBeGreaterThan(0);
          expect(grid[row][col]).toBeLessThanOrEqual(9);
        }
      }

      // check if itsd a valid Sudoku solution
      const { solved } = solveGrid({ grid, countSolutions: false, limit: 1 });
      expect(solved).toBe(true);
    });

    it('should generate different grids on multiple calls', () => {
      const grid1 = generateCompletedGrid();
      const grid2 = generateCompletedGrid();

      // grids should be different
      expect(grid1).not.toEqual(grid2);
    });
  });

  describe('solveGrid', () => {
    it('should solve a valid puzzle', () => {
      const { solved } = solveGrid({
        grid: samplePuzzleGrid,
        countSolutions: false,
        limit: 1,
      });
      expect(solved).toBe(true);
    });

    it('should solve a completed grid', () => {
      const { solved } = solveGrid({
        grid: sampleCompletedGrid,
        countSolutions: false,
        limit: 1,
      });
      expect(solved).toBe(true);
    });

    it('should not solve an invalid grid', () => {
      // Create a grid that has some empty cells but is unsolvable due to constraints
      const unsolvableGrid: Grid = invalidGrid;

      const { solved } = solveGrid({
        grid: unsolvableGrid,
        countSolutions: false,
        limit: 1,
      });
      expect(solved).toBe(false);
    });

    it('should count multiple solutions when requested', () => {
      // create a grid with multiple solutions
      const grid: Grid = emptyGrid;

      const { solved, solutions } = solveGrid({
        grid,
        countSolutions: true,
        limit: 3,
      });
      expect(solved).toBe(true);
      expect(solutions).toBeGreaterThan(1);
    });
  });

  describe('makePuzzle', () => {
    it('should create a puzzle with specified number of clues', () => {
      const { puzzle, solution } = makePuzzle({
        completed: sampleCompletedGrid,
        clues: 40,
      });

      // Count filled cells in puzzle
      const filledCells = puzzle.flat().filter((cell) => cell !== 0).length;
      expect(filledCells).toBeLessThanOrEqual(40);

      // Solution should match the original
      expect(solution).toEqual(sampleCompletedGrid);

      // Puzzle should be solvable
      const { solved } = solveGrid({
        grid: puzzle,
        countSolutions: false,
        limit: 1,
      });
      expect(solved).toBe(true);
    });

    it('should create a valid puzzle with default clues', () => {
      const { puzzle } = makePuzzle({
        completed: sampleCompletedGrid,
        clues: 40,
      });

      // Should have some empty cells
      const hasEmptyCells = puzzle.flat().some((cell) => cell === 0);
      expect(hasEmptyCells).toBe(true);

      // Should be solvable
      const { solved } = solveGrid({
        grid: puzzle,
        countSolutions: false,
        limit: 1,
      });
      expect(solved).toBe(true);
    });
  });

  describe('isValidMove', () => {
    it('should validate a correct move', () => {
      const isValid = isValidMove({
        grid: samplePuzzleGrid,
        row: 0,
        col: 2,
        value: 4,
      });
      expect(isValid).toBe(true);
    });

    it('should reject an invalid move that violates row rule', () => {
      const grid = cloneGrid(samplePuzzleGrid);
      grid[0][2] = 5; // Place 5 in position that conflicts with row

      const isValid = isValidMove({
        grid,
        row: 0,
        col: 3,
        value: 5,
      });
      expect(isValid).toBe(false);
    });

    it('should reject an invalid move that violates column rule', () => {
      const grid = cloneGrid(samplePuzzleGrid);
      grid[0][2] = 6; // Place 6 in position that conflicts with column

      const isValid = isValidMove({
        grid,
        row: 1,
        col: 2,
        value: 6,
      });
      expect(isValid).toBe(false);
    });

    it('should reject an invalid move that violates 3x3 box rule', () => {
      const grid = cloneGrid(samplePuzzleGrid);
      grid[0][2] = 5; // Place 5 in position that conflicts with 3x3 box

      const isValid = isValidMove({
        grid,
        row: 1,
        col: 1,
        value: 5,
      });
      expect(isValid).toBe(false);
    });

    it('should reject values outside 1-9 range', () => {
      const isValid1 = isValidMove({
        grid: samplePuzzleGrid,
        row: 0,
        col: 2,
        value: 0,
      });
      expect(isValid1).toBe(false);

      const isValid2 = isValidMove({
        grid: samplePuzzleGrid,
        row: 0,
        col: 2,
        value: 10,
      });
      expect(isValid2).toBe(false);
    });
  });

  describe('cloneGrid', () => {
    it('should create a deep copy of the grid', () => {
      const original = sampleCompletedGrid;
      const cloned = cloneGrid(original);

      // Should be equal but not the same reference
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[0]).not.toBe(original[0]);
    });

    it('should not affect original when cloned grid is modified', () => {
      const original = cloneGrid(sampleCompletedGrid);
      const cloned = cloneGrid(original);

      cloned[0][0] = 999;

      expect(original[0][0]).not.toBe(999);
      expect(cloned[0][0]).toBe(999);
    });
  });

  describe('createEmptyNotesGrid', () => {
    it('should create a 9x9 grid of empty sets', () => {
      const notesGrid = createEmptyNotesGrid();

      expect(notesGrid).toHaveLength(9);
      expect(notesGrid[0]).toHaveLength(9);

      // All sets should be empty
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          expect(notesGrid[row][col]).toBeInstanceOf(Set);
          expect(notesGrid[row][col].size).toBe(0);
        }
      }
    });

    it('should create independent sets for each cell', () => {
      const notesGrid = createEmptyNotesGrid();

      // Add note to one cell
      notesGrid[0][0].add(5);

      // Other cells should remain empty
      expect(notesGrid[0][1].size).toBe(0);
      expect(notesGrid[1][0].size).toBe(0);
      expect(notesGrid[1][1].size).toBe(0);
    });
  });
});
