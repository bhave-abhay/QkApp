# Requirements
1. [JQuery 3.3.1](https://code.jquery.com/jquery-3.3.1.min.js)
2. [Bootstrap 4.0](https://getbootstrap.com/docs/4.0/getting-started/download/)

# See QkApp in action.
### [UI demo](https://bhave-abhay.github.io/QkApp/demo/)
### [API gateway demo](https://bhave-abhay.github.io/QkApp/demo/api-gateway-demo.html)

# Docs
[Read docs](https://bhave-abhay.github.io/QkApp/docs/)

# Basically, why?!
QkApp is a micro-framework which, by design, does NOT generate html for you
(with minor exception like, for instance, the dialog buttons). Instead, QkApp works
like a thin wrapper around the  mostly pre-existing html mark-up.

This approach enables the html designer to have full control over the html, and
on the other hand, it empowers the front end developer to utilize the designed html pages
in their apps with very little additional mark-up that conveys developer's design intentions to
QkApp library.

As an example for this difference in design approach, let us consider the common use case of "Forms"

Unlike many libraries that provide 'forms' which take "form fields specifications" as input, and render the
resulting html form themselves, QkApp provides jQuery widget to turn an html element
into a QkForm. Now, just like any other jQuery object, you can play with it as usual.
QkForm does not generate forms for your specifications. Instead, the developer has complete
freedom over the form html, and can write the form exactly as is needed.

In addition to that,
the developer may also identify some of the input fields whose change event needs to trigger
form validation, with [`data-qkform-causesvalidation`](#data-qkform-causesvalidation) property.
Also, the developer may specify which element to use, in order to display a list of validation error
messages, with [`data-qkform-role`](#data-qkform-role) property.


This way, by adding simple annotations to html markup, QkApp works mostly behind
the screen, with your html, just as you wrote it.

QkApp is designed to separate the html mark-up and it's "App-like" behavior.
Designed to control the html, and not to generate it, QkApp offers completely
predictable html rendering of your app.

QkApp is tested for BootStrap v4 vanilla, and on all themes of BootSwatch v4.
On 3 or 4 of the BootSwatch themes (out of 12) there are some minor display glitches.
But overall, no showstopper UI issues on any of those, and NO functional issue on any. 8-)

It is also tested on [Bootstrap.386](#bootstrap-386) - one of my most favourite
BootStrap customization ;) . Not a bad show either, but the BootStrap v4
round corners ruin half the fun it has with BootStrap v3.x.

### What QkApp is NOT!
- QkApp is NOT a theming tool. It does not even define a single css class of it's own.
  - All the classes it uses by default are from bootstrap-4, so any customization thereof is readily compatible with it.
  - Almost all of the classes it assigns are configurable. You are free to choose ANY!
    - [TODO - add config for EVERY class which QkApp assigns to any elements.]
- QkApp does not a server side software. It works in browser, and facilitates some "meta" capabilities generally needed for any and all APPs, like handling a form as, well, just that - a form, or showing a form in dialog or a wizard or elsewhere.

# Now, what is QkApp?
QkApp provides a system of many components that can be used with each other seamlessly,
allowing whatever combinations you want off them.

- [UI Components](#ui-components)
  - [QkAlert](#1-qkalert)
  - [QkForm](#2-qkform)
  - [QkDialog](#3-qkdialog)
  - [QkWizard](#4-qkwizard)
- [Script Components](#script-components)
  - [QkAPIGateway](#qkapigateway)
  - [QkLoginManager](#qkloginmanager)
  - [QkSession](#qksession)

## QkApp Components
- [UI Components](#ui-components)
  - The UI components use existing html markup to create smart components of your application
  - [QkAlert](#qkalert)
     - Adds to the element the capability to display simple, dismissable BootStrap alerts inside it with a simple show_alert(...) api.
  - [QkForm](#qkform)
     - Forms are not scattered pieces of info, it is usually a single business logic object(s) that the information entered in the form represents.
     - QkForms allows you to display and read the form data as a single object.
     - You are free to define the actual logic of displaying / getting the whole data object.
       - you need to specify one callback that shows data from arg object into the form.
	   - You need to specify one callback that return an object with values as represented in form.
	   - No validation rules are considered in this callback definition.
     - After creating a QkForm, you can access the data object represented by the forms with [`qkval`](#qkval) api.
     - Whenever an attempt to read qkval is made, QkForm raises a `"qkform:validate"` event
       - Handler of this event receives 2 arguments
         - evt {object} represents the event
         - vetoPoll {object} this is where you can `veto` a validation, declaring your objection on the validity of the values.
         - `vetoPoll.veto` has 2 arguments
           - msg {string} the human readable error message
           - id of the element which needs to be highlighted as erroneous field.
         - When ant least one listener vetoes validation, the qkval is reported to be undefined to the caller. If there is no veto, it constructs the qkvql object with your callback, and returns it.
  - [QkDialog](#qkdialog)
  - [QkWizard](#qkwizard)
- [App Components](#app-components)
  - [QkAPIGateway](#qkapigateway)
     - Customizable API gateway
	 - Promise based, simple API. [See demo](https://bhave-abhay.github.io/QkApp/demo/api-gateway-demo.html) 
  - [QkLoginManager](#qkloginmanager)
  - [QkSession](#qksession)
