# koala 🐨
Perform quick actions directly from your browser search bar. No installation is needed!

## See it on action! 🎬

https://user-images.githubusercontent.com/5447552/230737763-ce01576a-94ee-4334-a220-d5514d4eb297.mp4

Just type one of the supported commands with or without parameters to quickly access the website you want.

*This product was inspired by Facebook/Meta's bunnylol search engine but faster/easier to setup and no need of external servers*

## Configure Chrome (and still keep Google!) 🌐

We all love Google. Don't worry. **If Koala doesn't recognize the command then it'll just Google it by default**. However, to use Koala and keep Google suggestions, follow these steps:

https://user-images.githubusercontent.com/5447552/230739462-514c8472-d511-4eea-8c42-bfb225cc8e72.mp4

1. Setup Koala as your default engine (don't worry, you'll keep Google! Any non-existent command will be Googled).
  1. Add any name and shortcut you want but make sure the URL is `https://us-central1-koala-search.cloudfunctions.net/koalapp?q=%s` (or `http://localhost:3000/?q=%s` if you're using your own server).
  1. Make Koala the default search engine.
1. Change Google to have shortcut as `g`.
1. Voilá. You can now search with Koala, if you need google suggestions, just type `g` followed by a space.
