# QkApp

## Introduction

QkApp is a minimalist Web browser / JS app framework built on BootStrap and JQuery.

### Basic Usage
```javascript
var app = new QkApp($, {});
window.alert = app.show_dialog.bind(app);
```

## Components
QkApp provides
- [UI Components](#ui-components)
  - [QkAlert](#qkalert)
  - [QkForm](#qkform)
  - [QkDialog](#qkdialog)
  - [QkWizard](#qkwizard)
- [App Components](#app-components)
  - [QkAPIGateway](#qkapigateway)
  - [QkLoginManager](#qkloginmanager)
  - [QkSession](#qksession)

### UI Components
QkApp does not generate HTML forms, neither does it plan to do so in near future.
However, Qkapp provides thin programmable wrappers around your existing html markup.
This gives the html designers and programmers complete freedom of design and ease of programming at the same time.

#### QkAlert
QkAlert is a JQuery plugin provided by QkApp. It converts any element into an alert container.
- Usage
```javascript
var myAC = $('#MyAlertContainer').QkAlert();
myAc.show_alert('Hello, alerts!');
myAc.show_alert('QkAlerts are customizable', 'alert-success');
myAc.show_alert('They have a customizable timeout too!', 'alert-danger', 3/*seconds*/);
```

A simpler way to use this alert feature is to add html markup for QkApp-Role property.
Anywhere in your page body, any container element can be assigned a property
`data-qkapp-role="alert-container"`. The first element in body to have this attribute is
the default alert container for QkApp. Thus, if this attribute is set on the desired container,
with the above basic constructor and window.alert function binding, you can access this feature
via your standard (or with additional QkAlert params) window.alert calls.
