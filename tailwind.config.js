module.exports = {
  mode: "jit",
  darkMode: "class", // or 'media' or 'class'
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: {
    content: ["./src/**/*.js", "./src/**/**/*.js", "./public/index.html"],
  },

  theme: {
    fill: (theme) => ({
      red: theme("colors.red.primary"),
    }),
    colors: {
      white: "#ffffff",
      blue: {
        medium: "#005c98",
      },
      black: {
        light: "#262626",
        faded: "#00000059",
      },
      gray: {
        base: "#616161",
        background: "#fafafa",
        primary: "#dbdbdb",
      },
      red: {
        primary: "#ed4956",
      },
      oasis_lightB_Bg: "#36393f",
      oasis_darkB_Bg: "#202225",
      oasis_blue: "#295DE7",
      oasis_blurple: "#7289da",
      oasis_purple: "#5865f2",
      oasis_green: "#3ba55c",
      oasis_channels_bg: "#2f3136",
      oasis_serverNameHover_bg: "#34373c",
      oasis_channel_text: "#8e9297",
      oasis_channelHover_bg: "#3a3c43",
      oasis_userId: "#b9bbbe",
      oasis_iconHover_bg: "#3a3c43",
      oasis_midB1_Bg: "#292b2f",
      oasis_iconHover: "#dcddde",
      oasis_chatHeader: "#72767d",
      oasis_chatHeaderInput: "#202225",
      oasis_chatInput_bg: "#40444b",
      oasis_chatInputText: "#dcddde",
      oasis_chatInput: "#72767d",
      oasis_message_bg: "#32353b",
      oasis_deleteIcon: "#ed4245",
    },
  },
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
};
