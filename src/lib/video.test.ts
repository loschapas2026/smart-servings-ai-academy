import { describe, it, expect } from "vitest";
import { embedOf, thumbOf } from "./video";
describe("vídeos", () => {
  it("converte link do YouTube em player", () => {
    expect(embedOf("https://www.youtube.com/watch?v=aircAruvnKk")).toBe("https://www.youtube.com/embed/aircAruvnKk?rel=0&modestbranding=1");
  });
  it("converte link do Vimeo em player", () => {
    expect(embedOf("https://vimeo.com/76979871")).toBe("https://player.vimeo.com/video/76979871");
  });
  it("gera capa a partir do YouTube", () => {
    expect(thumbOf({ video_url: "https://youtu.be/aircAruvnKk" })).toBe("https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg");
  });
});
