## Welcome to QkApp
A Qk Simple, minimalistic JS app framework for browser

### Requirements
1. Bootstrap 4.0
2. JQuery 3.3.1

### Demo
[See demo](https://bhave-abhay.github.io/QkApp/demo/)

### Docs
[Read docs](https://bhave-abhay.github.io/QkApp/docs/)
### How to use

Basic Usage:-
```javascript
var app = new QkApp($, {});
window.alert = app.show_alert.bind(app);
```

#### 1. QkAlert
QkAlert is a JQuery plugin provided by QkApp. It converts any element into an alert container.

##### html
###### Additional html mark-up
1. `<div data-qkapp-role="alert-container">...</div>`
	- This data property can be used on any container of your choice.
	- All the QkAlerts are pushed into first qkapp alert container in the
document, identified by this attribute.
##### javascript
```javascript
alert('Hello, alerts!');
alert('QkAlerts are customizable', 'alert-success');
alert('They have a customizable timeout too!', 'alert-danger', 3/*seconds*/);
```

Anywhere in your page body, a container element can be assigned a property
`data-qkapp-role="alert-container"`. The first element in body to have this attribute is
the default alert container for QkApp. Thus, if this attribute is set on the desired container,
with the above basic constructor and window.alert function binding, you can access this feature
via your standard (or with additional QkAlert params) window.alert calls.


#### 2. QkForm
This widget provides a thin wrapper around html forms with ability to
read/write data as a whole object represented in the form rather than
individual bits and pieces. It allows you to read a form's "qk value".
Before giving a value out, it raises a validation event. Listeners to this
event get a veto poll along the event. You can put your veto if data is invalid.

`qkval` of a form is either a valid object (no listener vetoed read operation)
or is `undefined`.

The sample login form in demo is created as follows:
##### html
```html
<div id="formLogin" class="container">
	<div class="row">
		<div class="col-12">
			<div class="form-group has-feedback">
				<label for="txtUsername" class="label label-default">Enter user name</label>
				<input type="text" placeholder="User Name" class="form-control" id="txtUsername" data-qkform-causesvalidation="true">
			</div>
		</div>
		<div class="col-12">
			<div class="form-group has-feedback">
				<label for="txtPassword" class="label label-default">Enter password</label>
				<input type="password" placeholder="Password" class="form-control" id="txtPassword" data-qkform-causesvalidation="true">
			</div>
		</div>
		<div class="col-12" data-qkform-role="validation-summary">

		</div>
	</div>
</div>
```
##### additional html mark-up
1. `data-qkform-causesvalidation="true"`
	- This attribute can be used on input of any control in a qk form.
	- With this attribute set to true, the QkForm is validated on change of the input
2. `data-qkform-role="validation-summary"`
	- This attribute can be used on any container in the QkForm.
	- The ul element containing validation messages list items is appended to this element.

##### javascript
```javascript
var formLogin = $('#formLogin').QkForm({
        cbGetData: function () {
            return {
                'sUserId': $('#txtUsername').val(),
                'sPswdHash': CryptoJS.SHA512($('#txtPassword').val()).toString().toUpperCase()
            };
        },
        cbShowData: function (objData) {
            $('#txtUsername').val(objData.sUserId);
            $('#txtPassword').val('');
        }
    });
    formLogin.on('qkform:validate', function (evt, vetoPoll) {
        var eltUserName = $('#txtUsername');
        var eltPswd = $('#txtPassword');
        if (eltUserName.val() === '') {
            vetoPoll.veto('User name not entered', 'txtUsername');
        }
        if (eltPswd.val() === '') {
            vetoPoll.veto('Password not entered', 'txtPassword');
        }
    });
```

#### 3. QkDialog
This widget provides a thin wrapper around bootstrap modal dialog.
It re-uses the whole dialog dom. It is therefore, by design, always non-recursive.

##### html
This is the common, re-used mark-up for dialog.
Except for `data-qkapp-role="dialog"` attribute, it is standard, but empty template for
bootstrap modal dialog
```html
<div data-qkapp-role="dialog" class="modal" role="dialog" style="background-color: rgba(0, 0, 0, 0.5);">
	<div class="modal-dialog container">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Title</h4>
				<button type="button" class="close" title="Escape">×</button>
			</div>
			<div class="modal-body">
			</div>
			<div class="modal-footer">
			</div>
		</div>
	</div>
</div>
```
##### additional html mark-up
1. `data-qkapp-role="dialog"`
	- This data property is used on a bootstrap dialog element.
	- It's header, footer and body elements are identified with corresponding bootstrap classes.
	- This dialog element is (re)used as the dialog element for all dialogs.
	- For more info, see [Dialog api](#dialog-api) [TODO: Document dialog api].

##### Basic Usage
###### javascript
```javascript
app.show_dialog(
  'Dialog Title',
  'Dialog text goes her. For simple dialogs, it\'s simply string. For more complex interaction, you can use QkForm feature'
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
#####Usage with QkForms
It provides `.buttons([{...}, ...])` api for adding buttons and assigning their
respective display classes and click handlers.
The click handler assigned to a QkDialog button receives a dialogState object.
It has 2 properties, viz
- `fValid`
  - true if the QkForm shown in the dialog is validated successfully
  - false if any of the QkForm's validate event listeners `veto`ed the read operation
- `formData`
  - value returned by the QkForm's  `qkval`. is `undefined` when QkForm's validation is `veto`ed

The sample login dialog in demo is created, based on above form, as follows:

##### javascript
```javascript
app.show_dialog('Login', formLogin, { 'sUserId': 'Abhay.Bhave' })
	.buttons([{
		'sText': 'Login',
		'cssClasses': 'btn-success',
		'onClick': function (dialogState) {
			if (dialogState.fValid) {
				app.show_dialog('FormData (Dialog timeout: 5 sec)', '<pre>' + JSON.stringify(dialogState.formData, null, '\t') + '</pre>', {}, 5)
					.buttons([{
						'sText': 'Close',
						'cssClasses': 'btn-success',
						'onClick': function () { app.hide_dialog(); }
					}])
			}
		}
	}, {
		'sText': 'Cancel',
		'cssClasses': 'btn-danger',
		'onClick': function () {
			app.hide_dialog();
			alert('Login calcelled!', 'alert-danger');
		}
	}]);
```
