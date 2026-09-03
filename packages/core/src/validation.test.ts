import { describe, expect, it } from "vitest";
import { validateField, validateForm } from "./validation";

describe("validateField", () => {
  it("required rejects empty variants", async () => {
    const rule = [{ required: true, message: "必填" }];
    expect(await validateField(undefined, rule)).toBe("必填");
    expect(await validateField(null, rule)).toBe("必填");
    expect(await validateField("", rule)).toBe("必填");
    expect(await validateField("  ", rule)).toBe("必填");
    expect(await validateField([], rule)).toBe("必填");
    expect(await validateField("x", rule)).toBeNull();
  });

  it("skips non-required rules when value is empty", async () => {
    const rules = [{ pattern: /^a/, message: "须以 a 开头" }];
    expect(await validateField("", rules)).toBeNull();
  });

  it("pattern and type=email", async () => {
    expect(await validateField("bob", [{ pattern: /^[a-z]+$/, message: "小写字母" }])).toBeNull();
    expect(await validateField("Bob", [{ pattern: /^[a-z]+$/, message: "小写字母" }])).toBe("小写字母");
    expect(await validateField("a@b.c", [{ type: "email", message: "邮箱格式不正确" }])).toBeNull();
    expect(await validateField("abc", [{ type: "email", message: "邮箱格式不正确" }])).toBe("邮箱格式不正确");
  });

  it("min/max/len for strings and numbers", async () => {
    expect(await validateField("ab", [{ min: 2, max: 5, message: "2-5 字符" }])).toBeNull();
    expect(await validateField("a", [{ min: 2, max: 5, message: "2-5 字符" }])).toBe("2-5 字符");
    expect(await validateField("abcdef", [{ min: 2, max: 5, message: "2-5 字符" }])).toBe("2-5 字符");
    expect(await validateField("12345678", [{ len: 8, message: "须 8 位" }])).toBeNull();
    expect(await validateField(3, [{ min: 1, max: 10, message: "1-10" }])).toBeNull();
    expect(await validateField(30, [{ min: 1, max: 10, message: "1-10" }])).toBe("1-10");
  });

  it("returns first failing rule's message", async () => {
    const rules = [
      { required: true, message: "第一" },
      { pattern: /^\d+$/, message: "第二" },
    ];
    expect(await validateField("", rules)).toBe("第一");
    expect(await validateField("abc", rules)).toBe("第二");
  });

  it("supports sync and async custom validators", async () => {
    expect(
      await validateField("x", [{ message: "兜底", validator: (v) => v === "x" }]),
    ).toBeNull();
    expect(
      await validateField("y", [{ message: "兜底", validator: (v) => v === "x" }]),
    ).toBe("兜底");
    expect(
      await validateField("z", [{ message: "兜底", validator: async () => "自定义错误" }]),
    ).toBe("自定义错误");
  });
});

describe("validateForm", () => {
  const rules = {
    username: [{ required: true, message: "请输入用户名" }],
    email: [{ type: "email", message: "邮箱格式不正确" }],
  };

  it("resolves values when all pass", async () => {
    await expect(validateForm({ username: "陈", email: "a@b.c" }, rules)).resolves.toEqual({
      username: "陈",
      email: "a@b.c",
    });
  });

  it("rejects with field→message errors", async () => {
    try {
      await validateForm({ username: "", email: "bad" }, rules);
      expect.unreachable("should reject");
    } catch (errors) {
      expect(errors).toEqual({
        username: "请输入用户名",
        email: "邮箱格式不正确",
      });
    }
  });
});
