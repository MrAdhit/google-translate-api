import { assertEquals } from "https://deno.land/std@0.161.0/testing/asserts.ts";
import { Translator } from "./main.ts";

Deno.test(async function test_translate() {  
  assertEquals((await new Translator().translate("Kamu")).text, "You");
});