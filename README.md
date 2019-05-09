# skincare-compare
my 20+ something yr old skin is as sensitive as an angsty teenager and throws tantrums in the form of eczema breakouts and i am creating a script to compare ingredients so i can appease the evil epidermis lords

# plan
- techy stuff:

~~i'll probably use python flask since i prefer writing in python (for simple things). for the front-end, probably twitter bootstrap and vanilla js and nothing fancy bc i don't want to deal w node or react or w/e. i'm basically going to render a static page and just dump it into the flask app to process~~

~~will probably deploy w heroku bc unfortunately, github pages only renders static apps. i guess i could write the backend with javascript but why would i~~

~~don't forget requirements.txt~~

after consulting w a js goddess, i'm probably just going to draw a transmutation circle and code this all in vanilla js + twitter bootstrap just so i can host this on gh pages and hope it turns out ok bc i'm lazy 

# features:
## BASIC FEATURES 
  - basically, do a compare and extract all the common bad ingredients and all the 'good' ingrediennts
  - let user download basic spreadsheet in csv with exclusions 
  - fix error msgs
 ## FIRST STEPS FOR A BASIC APP
  - import a csv first, and compare ingredients based on commas with columns of bad/good (cause i already have a very intensive doc) 
 ## LATER FEATURES 
  - Import options
    - google docs
  - options of what to merge or not merge (dropdown link)
    - //option 1: to grab complete spreadsheet on both
    - //option 2: grab spreadsheet with exclusions -- if the ingredient is on the "safe" list, then it will not occur on the "allergic" list
    - //option 3: grab spreadsheet with just counts on both
    - //still want them to get spreadsheet with one misspelled or empty, so remove modal alerts and just print to page
  - Other downloadable options 
    - download as txt
  - Resources page
    - cosdna
    - https://www.sezia.co/
    - haven't gotten this to work but: https://github.com/ytilis/CosDNA_Compare/blob/master/cosdna.js
    - different bloggers i like
    - subreddits
  - Examples
    - csv example
    - Google Docs example
    - CosDna examples
  - Web scraping
     - import a csv of cosdna links with columns of bad/good 
        - requires some nifty web scraping
  - Inline ingredients compare:
    - later just maybe do columns in the web app so you don't have to import?

# checklist for la basic app
- [x] get js script wrking purely w csv and spits out in console
- [x] spit out on page (like a table) the common ingredients for top 10? 
- [ ] download to txt document or csv
- [x] make front-end pretty + simple
- [x] deploy to gh pages

# checklist for when la basic app works 
- [ ] then google docs link
- [ ] downloadable example csv
- [ ] import csv of cosdna links
- [ ] web columns of csv links
- [ ] make faq page
- [ ] skincare refs page

# refs
i haven't written a webapp in so long and i refuse to write in javascript so i need to consult beginner tutorials that i am compiling here:
somewhat inspired by: https://github.com/ytilis/CosDNA_Compare/blob/master/cosdna.js
- https://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server

