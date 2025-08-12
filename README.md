# Wonderlands UI Property Explorer

*Note: I will often use the terms inspect/explore interchangeably throughout this repo.*

*Note Two: This does require pak-file modding if you wish to implement this.*

This repo contains the code fragments for a tool that allows you to inspect/explore the properties available for a given UI element. I wrote this as a way of inspecting the properties available on UI screens, primarily to make it easier for making UI mods. The three files, `PropertyExplorer.js`, `PropertyExplorer.css`, and `PropertyExplorer.html` contain all you'll need to implement this tool. There are more details at the top of each of those files but essentially you just need to copy+paste their contents into the respective files and repak them. You can find more information on pakfile modding [here](https://github.com/BLCM/BLCMods/wiki/Pakfile-Modding).

Gearbox has switched over to using Coherent Labs' Prysm with Wonderlands after AutoDesk discontinued support for Scaleform in 2017. I wager Gearbox are going to continue using Prysm for BL4, so this should be a solution for inspecting UI properties in that game as well.

***Disclaimer:*** This tool is **not** for modifying game data at runtime, it is purely for inspecting what properties exist in the javascript layer of GBX's UI tech stack. If you are looking for a tool that gives you a nice GUI for changing game data on the fly, **this is not it**.

## Example: Implementing the Property Explorer for the Inventory
*Note: You can find an example of this in the example directory of this repo. You can search the files in there for `VAZU_MOD` to see the code changes.*
To implement this tool for exploring the inventories properties, we need to do a few things.
1. Unpak the games files
2. Identify the files to change
3. Implement the changes
4. Repak files

You will need the UnrealPak tool from UE4.26 **and** UE4.20 to do this.

### Unpaking the games files
*If you already have the game files unpaked, you can skip this.*
You can find more information on this [here](https://github.com/BLCM/BLCMods/wiki/Accessing-Borderlands-3-Data) but I'll explain it a bit here as well. Gearbox did a weird partial merge at somepoint in their development and you will need to use the UnrealPak.exe from UE4.26 to *unpak* the games files, which you can download from the Epic Games Launcher. 

Once you have that, I'd recommend getting the Wonderlands Data Processing scripts from Apocalyptech's repo that can be found [here](https://github.com/apocalyptech/wldata/). You will most likely need to change some of the paths set in the `unpack_wl.py` script, such as `UNREALPAK` and `WL_INSTALL_DIR`. You will also need to setup a `cryto.json` file containing the AES key. Apocalyptech has a sample in their repo and you will need the "base64-encoded version of the data representation of the encryption key (not just the text hex strings that you'll find on the internet). You can use an online converter like this one to do that conversion. You'll have the right string if it starts with EV7 and ends with 6c=." \-[BLCMWiki](https://github.com/BLCM/BLCMods/wiki/Accessing-Borderlands-3-Data)
 
### Identify the files to change
Once you have the games files unpaked, you will want to look for .js, html, and css files that correspond to whatever UI you are trying to inspect inside of "Game/uiresources/". For the inventory menu, this sits at "Game/uiresources/inventory/". Specifically, "Game/uiresources/inventory/inventory.html", "Game/uiresources/inventory/js/inventory.js", and "Game/uiresources/inventory/css/inventory.css".

Once we know what files we want to modify, we can setup our file structure for making the pakfile mod. I personally make an "export/" directory as my toplevel directory for the files that will go in my pakfile mods. When paking our files, it's important to remember that the "Game/" directory you will see when unpaking corresponds to "OakGame/Content/" when paking.

With that in mind, I will create the following directory structure, "\<MyWorkingDirectory\>/export/OakGame/Content/uiresources/inventory". I will then make the 3 following files: "../inventory/inventory.html", "../inventory/js/inventory.js", and "../inventory/css/inventory.css". Your resulting directory structure should look like this:
```
<MyWorkingDirectory>/export/OakGame/Content/uiresources/inventory/
- inventory.html
- js/
- - inventory.js
- css/
- - inventory.css
```
Make sure to copy+paste the entire contents of the source files (the ones located at "Game/uiresources/inventory/" into your newly created files. They should be exact copies at this stage.

### Implementing the changes
Now that we have our files setup for modification, we can finally begin making the actual changes to implement the tool. First, we're going to modify the "inventory.html" file to place the inspector window. We're going to copy the contents of `PropertyExplorer.html` (minus the comments) and paste them inside the `<div class="inventory_wrapper hidden">` element of our "inventory.html" file, but before the `<div class="weapons " id="weapons">` element. Second we're going to do the same thing for the .css file. Copy+paste the contents of `PropertyExplorer.css` to the bottom of our `inventory.css` file.

Last, we're going to copy+paste the contents of `PropertyExplorer.js` into our `inventory.js` file. However, there are two parts here. There is the `class PropertyExplorerObject...` segment and the `this.PropertyExplorerObject...` segment. For the class declaration, we want to copy+paste that below the `class Widget_Inventory...` declaration and above the `let inventoryArchetype...` line in our `inventory.js` file. Then we want to copy+paste the `this.PropertyExplorerObject = new PropertyExplorerObject(this.DataModel);` line into the `Init()` function inside the `Widget_Inventory` class. I personally have it at the end, below the `this.inventoryBackpack = document.getElementById("inventory-backpack");` line.

At this point your directory structure should match what I have in the example directory of this repo, and the contents of those files should match (except for the comments obviously). You can see the modifications I made inside the example files by searching for `VAZU_MOD`.

### Repaking our changes
Now that we've made our changes the last thing we need to do is repak our files and have them loaded back into the game. To repak our files, we will now need UE4.20 (again, result of some weird merging GBX did during development I suppose). Once you've downloaded UE4.20 from EGS, we are then going to want to run the `-Create` command using the UnrealPak.exe from our UE4.20 install and **not** the one from out UE4.26 install. The usage of that command is as follows: `UnrealPak <PakFilename> -Create=<ResponseFile> [Options]`.

The ResponseFile parameter is a .txt file that specifies where the files we want to pak are stored, and how we want to mount them in the format of 
```
"Absolute/Path/To/Files/" "Mounting/Location/"
```
Since we placed all of our mod files inside an "export/" directory, *and* we mirrored the games file structure within it, we can create a `ResponseFile.txt` (you can name this whatever you want) with the contents of 
```
"Absolute/Path/To/export/*" "../../../"
```
This tells UnrealPak to take all the files inside the export directory and to mount them at the top level, which is exactly what we want since the first directory inside export is `OakGame/`.

Once we have that, we can run the `-Create` UnrealPak command like so:
```
"Absolute/Path/To/UE4.20/UnrealPak.exe" "AbsolutePath/ToWhere/WeWant/OurPak_999.pak" -Create="AbsolutePath/To/ResponseFile.txt"
```

That should result in a `OurPak_999.pak` file being created at that specified location. Next we want to list the details of our newly created pak to make sure it was created correctly. 
*Note: this requires UE4.26's UnrealPak to inspect paked files if it's encrypted. We did not encrypt this so you can use the UE4.20 UnrealPak again.
```
"Absolute/Path/To/UE4.20/UnrealPak.exe" "AbsolutePath/ToWhere/WeWant/OurPak_999.pak" -list"
```

You should get a result that looks like the following:
```
LogPakFile: Display: Mount point ../../../OakGame/Content/uiresources/inventory/
LogPakFile: Display: "css/inventory.css" offset: 193680, size: 16453 bytes, sha1: BF2586E140758D46FF1E03DEFBF3E7CD6F11CCB0.
LogPakFile: Display: "inventory.html" offset: 210186, size: 9850 bytes, sha1: 0E1E22A9B58D038849130CF4D9CF2AF56FD6DEF6.
LogPakFile: Display: "js/inventory.js" offset: 220089, size: 35931 bytes, sha1: D823D5A48F72F79F4235B01D921EAD66A2FC21A6.
```
Notice how UnrealPak is smart enough to deduce a lower scoped mounting point for our Paks for us. This is why I prefer to mimic the project structure when making mods and leave the ResponseFile to mount at the toplevel. I don't have to worry about a file being mounted incorrectly :)

Once you're verified that your pakfile was created correctly, you can just drop it in your games paks directory, "C:\Program Files\Steam\steamapps\common\Tiny Tina's Wonderlands\OakGame\Content\Paks\" on Windows. However, I personally like to ensure my mods get loaded last so I would add a "~mods\" directory inside of that "Paks\" directory and place my pakfile inside of that. So our pakfile would sit at "..OakGame\Content\Paks\\~mods\OurPak_999.pak".

Once that's down, you should be able to just boot up the game, open the inventory, and see the property explorer, nothing else needed!
