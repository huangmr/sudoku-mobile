jest.mock("@react-native-async-storage/async-storage");

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getPlayedGames,
  markGamePlayed,
  mergePlayedGames,
} from "../src/storage/playedGames";

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

test("getPlayedGames returns empty set when no data", async () => {
  const played = await getPlayedGames();
  expect(played.size).toBe(0);
});

test("getPlayedGames parses stored data", async () => {
  await AsyncStorage.setItem("played_games", JSON.stringify(["1.1", "1.2"]));
  const played = await getPlayedGames();
  expect(played.has("1.1")).toBe(true);
  expect(played.has("1.2")).toBe(true);
  expect(played.size).toBe(2);
});

test("markGamePlayed adds puzzle to storage", async () => {
  await markGamePlayed("1.5");
  const played = await getPlayedGames();
  expect(played.has("1.5")).toBe(true);
});

test("markGamePlayed accumulates multiple puzzles", async () => {
  await markGamePlayed("1.1");
  await markGamePlayed("2.3");
  const played = await getPlayedGames();
  expect(played.has("1.1")).toBe(true);
  expect(played.has("2.3")).toBe(true);
});

test("markGamePlayed does not duplicate existing entries", async () => {
  await markGamePlayed("1.1");
  await markGamePlayed("1.1");
  const played = await getPlayedGames();
  expect(played.size).toBe(1);
});

test("mergePlayedGames adds multiple IDs at once", async () => {
  await mergePlayedGames(["1.1", "1.2", "1.3"]);
  const played = await getPlayedGames();
  expect(played.size).toBe(3);
  expect(played.has("1.2")).toBe(true);
});

test("mergePlayedGames merges with existing data", async () => {
  await markGamePlayed("1.1");
  await mergePlayedGames(["2.1", "3.1"]);
  const played = await getPlayedGames();
  expect(played.has("1.1")).toBe(true);
  expect(played.has("2.1")).toBe(true);
  expect(played.has("3.1")).toBe(true);
});
