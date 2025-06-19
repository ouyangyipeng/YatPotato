// General Interactor
// This file provides a general interface to call any interactor function.

import { getInteractor as getTasksInteractor, getInteractorDescription as getTasksInteractorDescription } from '../renderer/components/tasks/TasksListInteractor.js';

const interactors = new Map();
const interactorDescriptions = [];

/**
 * Initializes all interactors and stores their functions in a map.
 */
const initializeInteractors = () => {
  // --- Tasks Interactor ---
  const tasksInteractor = getTasksInteractor();
  for (const key in tasksInteractor) {
    if (Object.hasOwnProperty.call(tasksInteractor, key)) {
      if (interactors.has(key)) {
        console.warn(`Function name conflict: ${key} is already registered.`);
      }
      interactors.set(key, tasksInteractor[key]);
    }
  }
  interactorDescriptions.push(getTasksInteractorDescription);

  // --- Add other interactors here in the future ---
};

// Initialize all interactors on startup.
initializeInteractors();

/**
 * A general interface to call any interactor function dynamically.
 * @param {string} functionName - The name of the function to execute.
 * @param {...any} args - The arguments to pass to the function.
 * @returns {Promise<any>} The result from the called function.
 */
export const invoke = async (functionName, ...args) => {
  if (interactors.has(functionName)) {
    const func = interactors.get(functionName);
    try {
      return await func(...args);
    } catch (error) {
      console.error(`Error executing function '${functionName}':`, error);
      throw new Error(`Error executing function '${functionName}'.`);
    }
  } else {
    console.error(`Function '${functionName}' not found in any interactor.`);
    throw new Error(`Function '${functionName}' not found in any interactor.`);
  }
};

/**
 * Gets descriptions for all registered interactors.
 * @returns {string} A combined string of all interactor descriptions.
 */
export const getAllInteractorDescriptions = () => {
  // This can be expanded to combine descriptions from all interactors.
  // For now, it returns the description for the Tasks interactor.
  return interactorDescriptions.map(getDescription => getDescription()).join('\n');
};

/**
 * Returns a list of all available function names.
 * @returns {string[]} An array of all registered function names.
 */
export const getAvailableFunctions = () => {
  return Array.from(interactors.keys());
};
