module.exports = {
  title: 'Veniqa Documentation',
  description: 'Official Documentation for the Veniqa Open-Source E-commerce Solution',
  themeConfig: {
    logo: '/img/veniqa_logo_transparent_blue_black.png',
    smoothScroll: true,
    nav: [
      { text: 'Website', link: 'https://veniqa.com' },
      { text: 'Github', link: 'https://github.com/Viveckh/Veniqa' }
    ],
    sidebar: [
      ['/', 'Home'],
      {
        title: 'Servers Setup',
        path: '/servers/setup',
        sidebarDepth: 2,
        collapsable: false,
        children: [
          
        ]
      },
      ['/servers/environment-file-format', 'Server Environment File Format'],
      {
        title: 'Webclients',   // required
        path: '/webclients/architecture',   // optional, which should be a absolute path.
        sidebarDepth: 2,
        collapsable: false,
        children: [
          
        ]
      },
      {
        title: 'Local Docker Setup',
        path: '/dockersetup/dockersetup.md',
        sidebarDepth: 2,
        collapsable: false,
        children: []
      },
      {
        title: 'Email Setup',
        path: '/email-setup/email-setup.md',
        sidebarDepth: 2,
        collapsable: false,
        children: []
      },
      {
        title: 'AWS S3 Setup',
        path: '/aws-setup/s3setup.md',
        sidebarDepth: 2,
        collapsable: false,
        children: []
      },
      {
        title: 'SSL Setup',
        path: '/ssl-setup/ssl-setup.md',
        sidebarDepth: 2,
        collapsable: false,
        children: []
      }
    ]
  },
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        'ga': 'UA-157968226-2'
      }
    ]
  ]
    
}