# Introduction

QkApp is a minimalist Web browser / JS app framework built on BootStrap and JQuery.

## Basic Usage
```javascript
var app = new QkApp($, {});
window.alert = app.show_dialog.bind(app);
```

## QkApp Components
- [UI Components](#ui-components)
  - [QkAlert](#qkalert)
  - [QkForm](#qkform)
  - [QkDialog](#qkdialog)
  - [QkWizard](#qkwizard)
- [App Components](#app-components)
  - [QkAPIGateway](#qkapigateway)
  - [QkLoginManager](#qkloginmanager)
  - [QkSession](#qksession)


## Basic Usage:-
```javascript
var app = new QkApp(
	$, /* the jQuery object, for name conflict resolution */
	{} /* the options object. For UI only usage, defaults are sufficient. */
);
window.alert = app.show_alert.bind(app);
```
