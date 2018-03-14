## Welcome to SillyApp
A Silly Simple, minimalistic JS app framework for browser

### Requirements
1. Bootstrap
2. JQuery

### How to use
```markdown
//Basic Usage:-

var app = new SillyApp();
window.alert = app.show_alert.bind(app);

//And then,
//Of course, some [minimal] additional mark-up in html,

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
