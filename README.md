# koala 🐨
Perform quick actions directly from your browser search bar.

## See it on action! 🎬

https://user-images.githubusercontent.com/5447552/230737763-ce01576a-94ee-4334-a220-d5514d4eb297.mp4

Just type one of the supported commands with or without parameters to quickly access the website you want.

*This product was inspired by Facebook/Meta's bunnylol search engine but faster/easier to setup and no need of external servers*

## See all commands and add yours 🔧

https://user-images.githubusercontent.com/5447552/230737872-2cd37dbf-29d9-413b-a5fd-106952a42125.mp4

Just type `koala` and you'll be able to see all commands. If you want to add one, just add it! (If you're using a local server)

## Commands with arguments 🚀

If you want to add your own parameters, just add `%s` where the parameter needs to be present. Koala will handle the encoding automatically 😉

# Installation 💻 (Optional)

> :warning: Now you don't need to install the server if you want to use Koala. Skip this step and go to next section if you just want to use the default commands. Keep reading if you want to be able to add your own commands.

This installation will allow you to create your local server and be able to add custom commands to Koala:
1. `git clone https://github.com/aajn88/koala.git`
1. `cd koala`
1. Install & run:
```
npm install && npm install -g pm2 && pm2 start npm --name koala -- start
```

To stop it simply run from terminal `pm2 stop koala`.
To start it again just run `pm2 start npm --name koala -- start`.

## Configure Chrome (and still keep Google!) 🌐

We all love Google. Don't worry. **If Koala doesn't recognize the command then it'll just Google it by default**. However, to use Koala and keep Google suggestions, follow these steps:

https://user-images.githubusercontent.com/5447552/230739462-514c8472-d511-4eea-8c42-bfb225cc8e72.mp4

1. Setup Koala as your default engine (don't worry, you'll keep Google! Any non-existent command will be Googled).
  1. Add any name and shortcut you want but make sure the URL is `https://us-central1-koala-search.cloudfunctions.net/koalapp?q=%s` (or `http://localhost:3000/?q=%s` if you're using your own server).
  1. Make Koala the default search engine.
1. Change Google to have shortcut as `g`.
1. Voilá. You can now search with Koala, if you need google suggestions, just type `g` followed by a space.
