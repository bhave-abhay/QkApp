## Welcome to SillyApp
A Silly Simple, minimalistic JS app framework for browser

### Requirements
1. Bootstrap 4.0
2. JQuery 3.3.1

### How to use

Basic Usage:-
```javascript

var app = new SillyApp();
window.alert = app.show_alert.bind(app);

//And then,
//Of course, with some [minimal] additional mark-up in html,

app.show_dialog(
  'Dialog Title',
  'Dialog text goes her. For simple dialogs, it\'s simply string. For more complex interaction, you can use SillyForm feature'
).buttons([{
  'sText': 'Button 1',
  'cssClasses': 'btn-warning',
  'onClick': function(){
    app.hide_dialog();
  }
},{
  'sText': 'Button 2',
  'cssClasses': 'btn-danger',
  'onClick': function(){
    app.hide_dialog();
    alert('Button 2 pressed', 'alert-info', 3 /*sec timout*/);
  }
}]);
```
### Demo
[A demo with silly wizard sporting a few silly forms in a silly app...](https://bhave-abhay.github.io/sillyapp/test/)
Yeah... it's a silly world!

### Docs [TODO: Separate doc]
#### Additional html mark-up
1. `<div data-sillyapp-role="alert-container">...</div>`
This data propoerty can be used on any container of your choice.
All the SillyAlerts are pushed into first sillyapp alert container in the
document, identified by this attribute.

2. `<div data-sillyapp-role="dialog">...</div>`
This data propoery is used on a bootstrap dialog element. It's header, footer
and body elements are identified with corresponding bootstrap classes. This
dialog element is (re)used as the dialog element.
For more info, see Dialog api [TODO: Document dialog api].
