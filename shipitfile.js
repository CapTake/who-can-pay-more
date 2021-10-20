module.exports = shipit => {
    // Load shipit-deploy tasks
    require('shipit-deploy')(shipit)

    const HOME = '/home/wcpm'
  
    shipit.initConfig({
      default: {
        deployTo: HOME,
        ignores: [".git", ".env", "shipitfile.js", "node_modules", "src", "public"]
      },
      production: {
        servers: 'wcpm@173.212.193.132',
        branch: 'main',
      },
    })
    
    shipit.blTask('server:restart', async () => {
        await shipit.remote(`cd ${HOME}` + ' && docker-compose down && docker-compose up -d')
        shipit.emit('started')
    })

    shipit.blTask("copy-build", async () => {
        await shipit.copyToRemote(".", HOME);
        shipit.emit('copied')
    })
    shipit.on('copied', function() {
        shipit.start('server:restart')
    })
  }