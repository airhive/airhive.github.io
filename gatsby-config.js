module.exports = {
  siteMetadata: {
    title: `AirHive`,
    description: `AirHive, we are what we breathe.`,
    author: `@giuliovv`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `AirHive`,
        short_name: `AirHive`,
        start_url: `/SignInPage`,
        background_color: `#ffffff`,
        theme_color: `#feae2c`,
        display: `standalone`,
        icon: `src/images/airhive-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
  ],
}
