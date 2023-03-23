# GC.Spread.Sheets.Designer Wrapper for Angular

For complete information on how you can customize the Designer, refer to our online documentation - https://www.grapecity.com/spreadjs/docs/v14/online/spreadjs_designer_components.html

### `npm install`
The dependencies required to install

### `npm run start`
The dependencies required to start sample

### SpreadJS Designer Angular Wrapper Component Markup
```js
<designer></designer>
```

**styleInfo prop** Pass styleInfo to the component props to customize the designer's style.
```js
<designer [props]="props"></designer>
props = {
    styleInfo: "width: 100%; height: 98vh; margin-top: 10px",
    config: null,
    spreadOptions: {sheetCount: 2}
}
```

**config prop** Pass in the custom **config** to customize the Designer.
```js
<designer [props]="props"></designer>
props = {
    config: customConfig()
}

function customConfig() {
    //config import from local
    config.ribbon[0].buttonGroups.unshift(
        {
            "label":"NewDesigner",
            "thumbnailClass":"welcome",
            "commandGroup":{
                "children":[
                    {
                        "direction":"vertical",
                        "commands":[
                            "Welcome"
                        ]
                    }
                ]
            }
        }
    );
    let customCommand = {
        title: "Welcome",
        text: "Welcome",
        iconClass: "ribbon-button-welcome",
        bigButton: "true",
        commandName: "Welcome",
        execute: async (context, propertyName) => {
            alert('Welcome to new designer.');
        }
    }
    config.commandMap = {
        Welcome: customCommand
    }
    return config;
}
```
**designerInitialized event** Fired after instantiation.
```js
<designer (designerInitialized)="getDesigner($event)"></designer>
function getDesigner(event) {
    //this is designer instance
    console.log(event.designer);
}
```

**Apply License** You can register the below code in the component.ts file.
```js
//In src/app/app.component.ts file
import '@grapecity/spread-sheets-designer-resources-en';
import * as GC from '@grapecity/spread-sheets';
import '@grapecity/spread-sheets-designer';

//Apply License
GC.Spread.Sheets.LicenseKey = 'xxx';
(GC.Spread.Sheets as any).Designer.LicenseKey = 'xxx';
```