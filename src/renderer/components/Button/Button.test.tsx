import React from "react";
import { render } from "@testing-library/react";

import Button from "./Button";

describe("Button", () => {
  test("renders a basic Button component", () => {
    render(<Button label="Hello world!" />);
  });
});
