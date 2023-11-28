# Kelley_Lang_Varano_3950_P4
#

#database was created with userscript.js and script.js
#All rubic points have been implimented and extensivly tested
#Note:SMALL ERROR:Sometimes, following login, the homepage requires reload to make server call
#Steps
#
#Run node server.js to run server




#1. Open login.html, unless this is done. User will be redirected to login.html. Signup and then use the same password and username to log the username. This is done autaomically following signup
The user will then be automically logged in and brought to the homepage for the site. 
#Expand sidebar for labels 



#2. On this main page, the user will shown a basic broswing section, this is not the hieracahl browsing but allows a
simpler view for the user shown 20 at a time. At the top of this page is a search bar. Next to it, options are provided 
for which type of value the user would like search for. When clicking the search button, the resluts of the given search are displayed. 
All presentations of books accross the site allow the user to remove and add the given book to the collection



#3. Examine the sidebar. The second, option is a post function which allows a user to add a book to the site. 
This is done with unique IBSN'S
#3Next, the third option on the sidebar is the collection page. This displays the users collection. Allow them to view 
and edit it. 




#4. Next is the advanced browsing, which is essentially the implimentation of the hierarchal browsing. 
Type into the author feild, which, as it types will have a live updating recomendation for terms using a server call as a part of a live updating datlist.

As this updates, the year selector is additionally filled out with first, a value of nothing, which has not specification for 
year and is the default. The rest is years avalible in the search for the author. Press fetch button data to retrieve given paramter. (Note:This form for Fetch data is thrown below books, scroll to bottom for future books or use breakcrumbs)


As one browses using paramaters, breadcrumbs are genreated.  this is represented by two buttons,
click on the first button to return to the search of just the author depicted in the name. 
