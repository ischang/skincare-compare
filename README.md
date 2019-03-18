# skincare-compare
my 20+ something yr old skin is as sensitive as an angsty teenager and throws tantrums in the form of eczema breakouts and i am creating a script to compare ingredients so i can appease the evil epidermis lords

# plan
- techy stuff:
i'll probably use python flask since i prefer writing in python (for simple things). for the front-end, probably twitter bootstrap and vanilla js and nothing fancy bc i don't want to deal w node or react or w/e. i'm basically going to render a static page and just dump it into the flask app to process

will probably deploy w heroku bc unfortunately, github pages only renders static apps. i guess i could write the backend with javascript but why would i 

don't forget requirements.txt 

# features:
## BASIC FEATURES 
  - basically, do a compare and extract all the common bad ingredients and all the 'good' ingrediennts
     - possibly cross reference them on cosdna and https://www.sezia.co/
 ## FIRST STEPS FOR A BASIC APP
   - import a csv first, and compare ingredients based on commas with columns of bad/good (cause i already have a very intensive doc) 
  - maybe allow import from google docs 
 ## LATER FEATURES 
  - import a csv of cosdna links with columns of bad/good 
    - requires some nifty web scraping
  - later just maybe do columns in the web app so you don't have to import?
  - maybe a chrome extension because i hate myself 


# checklist for la basic app
- [ ] get python script to work w purely csv
- [ ] then google docs link
- [ ] make front-end pretty + simple
- [ ] deploy to heroku 

# refs
i haven't written a webapp in so long and i refuse to write in javascript so i need to consult beginner tutorials that i am compiling here:
- https://realpython.com/introduction-to-flask-part-1-setting-up-a-static-site/
- https://medium.freecodecamp.org/how-to-scrape-websites-with-python-and-beautifulsoup-5946935d93fe
