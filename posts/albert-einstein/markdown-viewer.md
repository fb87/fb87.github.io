# Markdown Vieeeeeeer

[Sun Oct 20 12:57:18 AM +07 2024]

---

I have bunch of markdown documents, I just wanna public it over e.g github page, possible?

> Sure! use such as [Hugo](https://gohugo.io) - static website generator to translate all markdown files to a website and then commit to github page repository, done.

Means, I have to run **hugo** all the time whenever there is something updated?

> Ya. Hit one command and everything will be good.

Two repositories?

> Ya, one for markdown, one for html stubs.

Kinda annoying! Couldn't be that simpler?

> Okay! might check [markdown viewer](https://github.com/fb87/fb87.github.io), about hundreds lines of code which used to view the markdown documents on-fly. Means it just loads the markdown file on-requested; converts to html page and display to viewer. What you wanna do is to put the loader (html + script) to your repository which contains markdown files and then it just works.

Means, the markdown files structure will be kept?

> Yup!

How does it work?

> Just a small script which used to load markdown file, use [marked js](https://marked.js.org/) to convert markdown to html then append main page.

Does it support styling?

> Check the `devel` folder, the `style.css` is where the viewer could be style with.

Great! will check then.
