require("dotenv").config();

require("@babel/register")({
  babelrc: false,
  presets: [
    [
      "@babel/env",
      {
        targets: {
          node: "12",
        },
      },
    ],
  ],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          api: "./api",
          lib: "./lib",
        },
      },
    ],
  ],
});

require("./api/server");
