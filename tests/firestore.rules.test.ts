/**
 * Firestore security rules tests. Runs only against the emulator:
 *   npx firebase-tools emulators:exec --only firestore --project demo-miraah "npx vitest run tests/firestore.rules.test.ts"
 * Skipped automatically when FIRESTORE_EMULATOR_HOST is not set.
 */
import { describe, it, beforeAll, afterAll, beforeEach } from "vitest";
import { readFileSync } from "fs";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, addDoc, collection, updateDoc, deleteDoc } from "firebase/firestore";

const hasEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);

describe.skipIf(!hasEmulator)("firestore.rules", () => {
  let env: RulesTestEnvironment;

  beforeAll(async () => {
    const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST as string).split(":");
    env = await initializeTestEnvironment({
      projectId: "demo-miraah",
      firestore: { rules: readFileSync("firestore.rules", "utf8"), host, port: Number(port) },
    });
  });
  afterAll(async () => env?.cleanup());
  beforeEach(async () => env.clearFirestore());

  it("a user can read and write only their own profile", async () => {
    const alice = env.authenticatedContext("alice").firestore();
    await assertSucceeds(setDoc(doc(alice, "users/alice"), { displayName: "A" }));
    await assertSucceeds(getDoc(doc(alice, "users/alice")));
    await assertFails(getDoc(doc(alice, "users/bob")));
    await assertFails(setDoc(doc(alice, "users/bob"), { displayName: "x" }));
  });

  it("anonymous visitors cannot read profiles or inspections", async () => {
    const anon = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(anon, "users/alice")));
    await assertFails(getDoc(doc(anon, "inspections/x")));
  });

  it("inspection records must carry the creator's uid", async () => {
    const alice = env.authenticatedContext("alice").firestore();
    await assertFails(addDoc(collection(alice, "inspections"), { inspectorUid: "bob", assetId: "1" }));
    await assertSucceeds(addDoc(collection(alice, "inspections"), { inspectorUid: "alice", assetId: "1", verified: true }));
  });

  it("inspection records reject unexpected fields", async () => {
    const alice = env.authenticatedContext("alice").firestore();
    await assertFails(addDoc(collection(alice, "inspections"), { inspectorUid: "alice", assetId: "1", role: "admin" }));
  });

  it("the inspection log is append-only, even for the creator", async () => {
    const alice = env.authenticatedContext("alice").firestore();
    const bob = env.authenticatedContext("bob").firestore();
    const ref = await addDoc(collection(alice, "inspections"), { inspectorUid: "alice", assetId: "1" });
    await assertSucceeds(getDoc(doc(bob, ref.path)));
    await assertFails(updateDoc(doc(alice, ref.path), { inspectorUid: "bob" }));
    await assertFails(updateDoc(doc(alice, ref.path), { assetId: "2" }));
    await assertFails(deleteDoc(doc(alice, ref.path)));
  });
});
