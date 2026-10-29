import { runWorkspaceSuite } from "./workspaceSuite";
import { MemoryRepo, MemoryBlobStore } from "../server/workspace/store";

runWorkspaceSuite("in-memory store", () => ({ repo: new MemoryRepo(), blobs: new MemoryBlobStore() }));
