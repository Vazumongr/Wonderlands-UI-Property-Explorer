"use strict";

class Widget_Inventory extends Widget_MenuBase
{
    Init()
    {
        super.Init();
        this.IsGearEnabled = true;
        this.isGearContainerFocused = false;
        this.container = this.WidgetDiv.firstElementChild;
        // this.container.classList.add("fade-out");
        this.IsBackpackContainerFocused = false;
        this.IsGearsContainerFocused = false;
        this.IsWeaponsContainerFocused = false;
        this.BackpackLoaded = false;
        this.Backpack = undefined;

        this.weaponsContainer = undefined;
        this.weaponsParentContainer = undefined;
        this.gearsContainer = undefined;
        this.gearsParentContainer = undefined;
        this.backpackContainer = undefined;

        this.weaponsArrowUp = undefined;
        this.weaponsArrowDown = undefined;

        this.BindInternalEvents = this.BindInternalEvents.bind(this);
        this.UnbindInternalEvents = this.UnbindInternalEvents.bind(this);
        this.OnClickArrowUp = this.OnClickArrowUp.bind(this);
        this.OnClickArrowDown = this.OnClickArrowDown.bind(this);
        this.WeaponsSplitHorizontalQuadMode = this.WeaponsSplitHorizontalQuadMode.bind(this);
        this.GearsSplitHorizontalQuadMode = this.GearsSplitHorizontalQuadMode.bind(this);
        this.BindGearIds = this.BindGearIds.bind(this);
        this.CheckSplitScreenMode = this.CheckSplitScreenMode.bind(this);

        // this.BindInternalSplitEvents = this.BindInternalSplitEvents.bind(this);
        // this.UnbindInternalSplitEvents = this.UnbindInternalSplitEvents.bind(this);

        this.WeaponsLoadoutContainerInputFocusChanged = this.WeaponsLoadoutContainerInputFocusChanged.bind(this);
        this.GearsContainerInputFocusChanged = this.GearsContainerInputFocusChanged.bind(this);
        this.BackpackWeaponsContainerInputFocusChanged = this.BackpackWeaponsContainerInputFocusChanged.bind(this);
        this.SwapItemSelected = this.SwapItemSelected.bind(this);

        this.SetContainerFocusIndex = this.SetContainerFocusIndex.bind(this);

        this.WeaponsLoadoutContainerInputSelectionChanged = this.WeaponsLoadoutContainerInputSelectionChanged.bind(this)
        this.GearsContainerInputSelectionChanged = this.GearsContainerInputSelectionChanged.bind(this)

        this.ShowItemCard = this.ShowItemCard.bind(this);

        this.DataModel.Event_StartDropAnimation = function ()
        {
            this.Event_StartDropAnimation()
        }.bind(this);
        this.DataModel.Event_StartRoomDecorationAnimation = function ()
        {
            this.Event_StartRoomDecorationAnimation()
        }.bind(this);
        this.DataModel.Event_RefreshAnim = function ()
        {
            this.Event_RefreshAnim()
        }.bind(this);
        this.DataModel.FocusGearsContainer = function ()
        {
            this.FocusGearsContainer()
        }.bind(this);
        this.DataModel.FocusWeaponsContainer = function ()
        {
            this.FocusWeaponsContainer()
        }.bind(this);
        this.DataModel.OnMouseLeaveGearsContainer = function ()
        {
            this.OnMouseLeaveGearsContainer()
        }.bind(this);
        this.DataModel.OnMouseLeaveWeaponsContainer = function ()
        {
            this.OnMouseLeaveWeaponsContainer()
        }.bind(this);
        this.DataModel.OnLoadBackpack = function (element)
        {
            this.OnLoadBackpack(element)
        }.bind(this);
        this.DataModel.OnBackpackSetFocus = function (focus)
        {
            this.OnBackpackSetFocus(focus)
        }.bind(this);
        this.DataModel.SelectBackpackItemByIndex = function (element)
        {
            this.SelectBackpackItemByIndex(element)
        }.bind(this);
        this.DataModel.OnClickPrevBackpackSort = function ()
        {
            this.OnClickPrevBackpackSort()
        }.bind(this);
        this.DataModel.OnClickNextBackpackSort = function ()
        {
            this.OnClickNextBackpackSort()
        }.bind(this);
        this.DataModel.OnBackpackVisible = function ()
        {
            this.OnBackpackVisible()
        }.bind(this);
        this.InventoryElements = [];

        this.DroppedDiv = this.WidgetDiv.getElementsByClassName("dropped")[0];
        this.RoomDecorationDiv = this.WidgetDiv.getElementsByClassName("room_decoration")[0];
        this.PrimaryItemCard = this.WidgetDiv.querySelector("#primary-item-card");
        this.SecondaryItemCard = this.WidgetDiv.querySelector("#secondary-item-card");
        this.PrimaryItemCardAB = this.WidgetDiv.querySelector("#primary-item-card-ab");
        this.SecondaryItemCardAB = this.WidgetDiv.querySelector("#secondary-item-card-ab");
        this.inventoryBackpack = document.getElementById("inventory-backpack");

        // VAZU_MOD: PROPERTY EXPLORER BEGIN
        this.PropertyExplorerObject = new PropertyExplorerObject(this.DataModel);
        // VAZU_MOD: PROPERTY EXPLORER END

        // this.WeaponsScale = anime({
        //     targets: '.weapons_guns_slots',
        //     scale: 1.15,
        //     duration: 100,
        //     easing: 'linear',
        //     autoplay: false
        // });
        // this.WeaponsResetScale = anime({
        //     targets: '.weapons_guns_slots',
        //     scale: 1,
        //     duration: 100,
        //     easing: 'linear',
        //     autoplay: false
        // });

        // this.GearsScale = anime({
        //     targets: '.weapons_gear',
        //     scale: 1.15,
        //     duration: 100,
        //     easing: 'linear',
        //     autoplay: false
        // });
        // this.GearsResetScale = anime({
        //     targets: '.weapons_gear',
        //     scale: 1,
        //     duration: 100,
        //     easing: 'linear',
        //     autoplay: false
        // });

        // this.BackpackScale = anime({
        //     targets: '.backpack_weapons',
        //     scale: 1.15,
        //     duration: 100,
        //     easing: 'linear',
        //     autoplay: false
        // });
        // this.BackpackResetScale = anime({
        //     targets: '.backpack_weapons',
        //     scale: 1,
        //     duration: 100,
        //     easing: 'linear',
        //     autoplay: false
        // });
    }

    RegisterEvents()
    {
        if (this.Archtype) return;

        super.RegisterEvents();

        this.RegisterWidgetEvent("StartDropAnimation", function ()
        {
            this.Event_StartDropAnimation();
        }.bind(this));

        this.RegisterWidgetEvent("StartRoomDecorationAnimation", function ()
        {
            this.Event_StartRoomDecorationAnimation();
        }.bind(this));

        this.RegisterWidgetEvent("Event_RefreshAnim", function () { this.Event_RefreshAnim(); }.bind(this));

        this.RegisterWidgetEvent("SwapItemSelected", function () { this.SwapItemSelected.apply(this, arguments); }.bind(this))

        this.RegisterWidgetEvent("SetContainerFocusIndex", function (containerIdent, index) { this.SetContainerFocusIndex.apply(this, arguments); }.bind(this));

        RegisterGlobalEvent("SetSplitScreenMode", function (splitMode, playerIndex) { this.CheckSplitScreenMode(); }.bind(this));
    }

    Create(widgetIdent)
    {
        let inst = new Widget_Inventory(this.ClassIdent, widgetIdent);
        return inst;
    }

    Event_StartDropAnimation()
    {
        this.DroppedDiv.classList.remove("droppedout");
        this.DroppedDiv.classList.remove("droppedin");

        if (this.equipmentfocus)
        {
            this.DroppedDiv.style.transform = "";
            this.DroppedDiv.classList.add("weapons_side");
            this.DroppedDiv.classList.remove("gear_side");
        }
        else if (this.backpackfocused)
        {
            this.DroppedDiv.style.transform = "";
            this.DroppedDiv.classList.remove("weapons_side");
            this.DroppedDiv.classList.remove("gear_side");
        }
        else if (this.gearfocus)
        {
            this.DroppedDiv.classList.add("gear_side");
            this.DroppedDiv.classList.remove("weapons_side");
        }


        if (this.DroppedAnimationPrevTO)
        {
            clearTimeout(this.DroppedAnimationPrevTO);
        }

        this.DroppedAnimationPrevTO = setTimeout(() =>
        {
            this.DroppedDiv.classList.add("droppedin");
            if (this.DroppedAnimationTO)
            {
                clearTimeout(this.DroppedAnimationTO);
            }
            this.DroppedAnimationTO = setTimeout(() =>
            {
                this.DroppedDiv.classList.add("droppedout");
            }, 1200);
        }, 100);
    }

    Event_StartRoomDecorationAnimation()
    {
        this.RoomDecorationDiv.classList.remove("roomout");
        this.RoomDecorationDiv.classList.remove("roomin");

        if (this.RoomDecorationAnimationPrevTO)
        {
            clearTimeout(this.RoomDecorationAnimationPrevTO);
        }

        this.RoomDecorationAnimationPrevTO = setTimeout(() =>
        {
            this.RoomDecorationDiv.classList.add("roomin");
            if (this.RoomDecorationAnimationTO)
            {
                clearTimeout(this.RoomDecorationAnimationTO);
            }
            this.RoomDecorationAnimationTO = setTimeout(() =>
            {
                this.RoomDecorationDiv.classList.add("roomout");
                this.RoomDecorationAnimationTOEnd = setTimeout(() =>
                {
                    this.RoomDecorationDiv.classList.remove("roomin");
                    this.RoomDecorationDiv.classList.remove("roomout");
                }, 1200);
            }, 1200);
        }, 100);
    }

    Event_RefreshAnim()
    {
        this.inventoryBackpack.refreshAnim();
    }

    Event_Activate()
    {
        super.Event_Activate();

        if (this.inventoryBackpack)
        {
            Delay.byFrame(() =>
            {
                this.inventoryBackpack.Activate();
            }, 3);
        }
        this.weaponsParentContainer = this.WidgetDiv.getElementsByClassName("weapons_guns_cntr")[0];
        this.gearsParentContainer = this.WidgetDiv.getElementsByClassName("weapons_gear_cntr")[0];

        this.weaponsContainer = this.WidgetDiv.getElementsByClassName("weapons_guns_slots")[0];
        this.gearsContainer = this.WidgetDiv.getElementsByClassName("weapons_gear")[0];
        this.weaponsPanel = this.WidgetDiv.querySelector("#weapons");


        this.weaponsArrowUp = this.WidgetDiv.querySelector("#inventory_weapons_arrow_up");
        this.weaponsArrowDown = this.WidgetDiv.querySelector("#inventory_weapons_arrow_down");


        this.backpackWeaponsContainer = this.WidgetDiv.getElementsByClassName("backpack_weapons")[0];
        this.backpackPanel = this.WidgetDiv.getElementsByClassName("backpack")[0];
        this.BindInternalEvents();

        this.CheckSplitScreenMode();

        this.BindGearIds();
    }

    CheckSplitScreenMode()
    {
        if (GlobalHelper.SplitMode == SplitModes.Full)
        {
            this.SetFullScreenMode();
        } else if (GlobalHelper.SplitMode == SplitModes.vertical)
        {
            this.SetVerticalSplitMode();
        } else if (GlobalHelper.SplitMode == SplitModes.horizontal || GlobalHelper.SplitMode == SplitModes.quad)
        {
            this.SetHorizontalSplitMode();
        }
    }

    SetFullScreenMode()
    {
        this.gearsParentContainer.classList.remove("d-none");
        this.weaponsParentContainer.classList.remove("d-none");
        this.weaponsArrowUp.classList.add("d-hidden");
        this.weaponsArrowDown.classList.add("d-hidden");
    }

    SetVerticalSplitMode()
    {

        this.gearsParentContainer.classList.remove("d-none");
        this.weaponsParentContainer.classList.remove("d-none");
        this.weaponsArrowUp.classList.add("d-hidden");
        this.weaponsArrowDown.classList.add("d-hidden");

        this.EquipRanged = this.WidgetDiv.querySelector("#equip_ranged");
        this.MeleeWeapon = this.WidgetDiv.querySelector("#melee_weapon");
        this.WeaponsGear = this.WidgetDiv.querySelector("#weapons_gear");


        delete this.EquipRanged.dataset.inputLinkLeft;
        delete this.MeleeWeapon.dataset.inputLinkRight;
        this.EquipRanged.dataset.inputLinkDown = "equip_melee";
        this.MeleeWeapon.dataset.inputLinkDown = "equip_gear";
        this.MeleeWeapon.dataset.inputLinkUp = "equip_ranged";
        this.MeleeWeapon.dataset.inputLinkRight = "backpack";
        this.WeaponsGear.dataset.inputLinkUp = "equip_melee";
    }

    SwapItemSelected(category)
    {
        console.log("SwapItemSelected", category)

        const backpackList = this.WidgetDiv.querySelector("#backpack");
        this.MeleeWeapon = this.WidgetDiv.querySelector("#melee_weapon");
        this.MeleeWeapon.dataset.inputLinkRight = "equip_ranged"
        backpackList.dataset.inputLinkLeft = "equip_ranged";


        switch (category)
        {
            case 0:
            case "Weapon": /* Default */ break;
            case "Melee":
                backpackList.dataset.inputLinkLeft = "equip_melee";
                this.MeleeWeapon.dataset.inputLinkRight = "backpack"
                break;
            default:
                backpackList.dataset.inputLinkLeft = "equip_gear";
                break;
        }

        console.log(backpackList.dataset.inputLinkLeft);


    }

    SetHorizontalSplitMode()
    {

        this.weaponsArrowUp.addEventListener("click", this.OnClickArrowUp);
        this.weaponsArrowDown.addEventListener("click", this.OnClickArrowDown);
        // Weapons is hidden, so, we need to display up arrow instead down arrow
        if (this.weaponsParentContainer.classList.contains("d-none"))
        {
            this.GearsSplitHorizontalQuadMode();
        } else
        {
            this.WeaponsSplitHorizontalQuadMode();
        }
    }

    OnClickArrowUp()
    {

        InputMgr.ClearFocusedElement();
        InputMgr.FocusWidgetElement("equip_ranged");
    }

    OnClickArrowDown()
    {
        InputMgr.ClearFocusedElement();
        InputMgr.FocusWidgetElement("equip_gear");
    }


    OnBackpackVisible()
    {
        this.BackpackLoaded = true;
        this.Backpack = this.WidgetDiv.querySelector("#backpack");
        this.IsBackpackContainerFocused = true;
        // this.BackpackScale.restart();
        this.gearsParentContainer.classList.remove("selected");
    }

    UnbindInternalEvents()
    {
        this.gearsContainer.removeEventListener("Event_InputFocusChanged", this.GearsContainerInputFocusChanged);
        this.gearsContainer.removeEventListener('Event_InputSelectionChanged', this.GearsContainerInputSelectionChanged);

        this.weaponsContainer.removeEventListener("Event_InputFocusChanged", this.WeaponsLoadoutContainerInputFocusChanged);
        this.weaponsContainer.removeEventListener('Event_InputSelectionChanged', this.WeaponsLoadoutContainerInputSelectionChanged);
        this.backpackWeaponsContainer.removeEventListener("Event_InputFocusChanged", this.BackpackWeaponsContainerInputFocusChanged);
    }

    BindInternalEvents()
    {
        this.gearsContainer.addEventListener('Event_InputFocusChanged', this.GearsContainerInputFocusChanged, true);
        this.gearsContainer.addEventListener('Event_InputSelectionChanged', this.GearsContainerInputSelectionChanged, true);

        this.weaponsContainer.addEventListener('Event_InputFocusChanged', this.WeaponsLoadoutContainerInputFocusChanged, true);
        this.weaponsContainer.addEventListener('Event_InputSelectionChanged', this.WeaponsLoadoutContainerInputSelectionChanged, true);
        this.backpackWeaponsContainer.addEventListener('Event_InputFocusChanged', this.BackpackWeaponsContainerInputFocusChanged, true);
    }

    BindGearIds()
    {
        const gearItems = this.gearsContainer.children;

        const ringSlot = gearItems[0];
        ringSlot.dataset.inputId = "equip_gear_ring";

        const shieldSlot = gearItems[1];
        shieldSlot.dataset.inputId = "equip_gear_shield";

        const amuletSlot = gearItems[2];
        amuletSlot.dataset.inputId = "equip_gear_amulet";

        const pauldronSlot = gearItems[4];
        pauldronSlot.dataset.inputId = "equip_gear_pauldron";

        const spellmodSlot = gearItems[5];
        spellmodSlot.dataset.inputId = "equip_gear_spellmod";
    }

    ShowItemCard()
    {
        if (this.DataModel.primaryitemcard.visible && this.DataModel.secondaryitemcard.visible)
        {
            this.SecondaryItemCardAB.firstElementChild.classList.add("mirror");

            if (GlobalHelper.SplitMode == SplitModes.vertical)
            {
                this.PrimaryItemCardAB.firstElementChild.style.left = "22.5vh";
                this.SecondaryItemCardAB.firstElementChild.style.right = "22.5vh";
            } else if (GlobalHelper.SplitMode == SplitModes.horizontal)
            {
                this.PrimaryItemCardAB.firstElementChild.style.left = "90vh";
                this.SecondaryItemCardAB.firstElementChild.style.right = "90vh";
            } else if (GlobalHelper.SplitMode == SplitModes.quad)
            {
                this.PrimaryItemCardAB.firstElementChild.style.left = "47vh";
                this.SecondaryItemCardAB.firstElementChild.style.right = "61vh";
            } else
            {
                //Full
                this.PrimaryItemCard.firstElementChild.style.transform = "translateX(-10vh)";
                this.SecondaryItemCard.firstElementChild.style.transform = "translateX(10vh)";
                this.SecondaryItemCard.firstElementChild.classList.add("mirror");
            }
        } else
        {
            this.SecondaryItemCardAB.firstElementChild.classList.remove("mirror");

            if (GlobalHelper.SplitMode == SplitModes.vertical)
            {
                this.PrimaryItemCardAB.firstElementChild.style.left = "30vh";
                this.SecondaryItemCardAB.firstElementChild.style.right = "28vh";
            } else if (GlobalHelper.SplitMode == SplitModes.horizontal)
            {
                this.PrimaryItemCardAB.firstElementChild.style.left = "90vh";
                this.SecondaryItemCardAB.firstElementChild.style.right = "90vh";
            } else if (GlobalHelper.SplitMode == SplitModes.quad)
            {
                this.PrimaryItemCardAB.firstElementChild.style.left = "63vh";
                this.SecondaryItemCardAB.firstElementChild.style.right = "77vh";
            } else
            {
                this.PrimaryItemCard.firstElementChild.style.transform = "translateX(0vh)";
                this.SecondaryItemCard.firstElementChild.style.transform = "translateX(0vh)";
                this.SecondaryItemCard.firstElementChild.classList.remove("mirror");
            }
        }

    }

    WeaponsLoadoutContainerInputSelectionChanged(data)
    {
        this.inventoryBackpack.scrollbar.resetScroll();
    }

    GearsContainerInputSelectionChanged(data)
    {
        this.inventoryBackpack.scrollbar.resetScroll();
    }

    WeaponsLoadoutContainerInputFocusChanged(data)
    {
        if (data.detail.focused == true)
        {

            if (!data.detail.firstFocus)
            {
                this.PlaySound("menu_navigation");


                this.weaponsPanel.classList.add("selected");
                this.equipmentfocus = true;

            }
        }
        else
        {
            this.equipmentfocus = false;
            this.weaponsPanel.classList.remove("selected");
        }
        if (data.detail.focused == true && !this.IsWeaponsContainerFocused)
        {
            this.IsWeaponsContainerFocused = true;
            this.IsGearsContainerFocused = false;
            this.IsBackpackContainerFocused = false;
            this.backpackPanel.classList.remove("selected");

            if (this.inventoryBackpack)
                this.inventoryBackpack.IsContainerFocused = false;

            if (GlobalHelper.SplitMode == SplitModes.full)
            {

            } else if (GlobalHelper.SplitMode == SplitModes.vertical)
            {

            } else if (GlobalHelper.SplitMode == SplitModes.horizontal || GlobalHelper.SplitMode == SplitModes.quad)
            {
                this.WeaponsSplitHorizontalQuadMode();
                if (this.Backpack)
                {
                    this.Backpack.dataset.inputLinkLeft = "equip_ranged";
                }
            }
        }
    }

    GearsContainerInputFocusChanged(data)
    {
        if (data.detail.focused == true)
        {


            if (!data.detail.firstFocus)
            {
                this.PlaySound("menu_navigation");
                this.weaponsPanel.classList.add("selected");
                this.gearfocus = true;
            }
        }
        else
        {

            this.gearfocus = false;
            this.weaponsPanel.classList.remove("selected");
        }
        if (data.detail.focused == true && !this.IsGearsContainerFocused)
        {
            if (this.DataModel.primaryitemcard.visible && this.DataModel.secondaryitemcard.visible)
            {
                // this.PrimaryItemCard.firstElementChild.style.left = "50vh";
                // this.SecondaryItemCard.firstElementChild.style.right = "20vh";
            } else
            {
                // this.PrimaryItemCard.firstElementChild.style.left = "30vh";
                // this.SecondaryItemCard.firstElementChild.style.right = "40vh";
            }

            // if (!this.IsGearsContainerFocused) {
            this.backpackPanel.classList.remove("selected");
            // this.weaponsContainer.classList.remove("selected");
            this.IsGearsContainerFocused = true;
            this.IsWeaponsContainerFocused = false;
            if (this.inventoryBackpack)
                this.inventoryBackpack.IsContainerFocused = false;
            this.IsBackpackContainerFocused = false;

            if (GlobalHelper.SplitMode == SplitModes.full)
            {

            } else if (GlobalHelper.SplitMode == SplitModes.vertical)
            {

            } else if (GlobalHelper.SplitMode == SplitModes.horizontal || GlobalHelper.SplitMode == SplitModes.quad)
            {
                this.GearsSplitHorizontalQuadMode();
                if (this.Backpack)
                {
                    this.Backpack.dataset.inputLinkLeft = "equip_gear";
                }
            }
        }
    }

    BackpackWeaponsContainerInputFocusChanged(data)
    {
        if (data.detail.focused == true && !data.detail.firstFocus)
        {
            this.PlaySound("menu_navigation");
            this.backpackPanel.classList.add("selected");
            this.weaponsPanel.classList.remove("selected");
            this.backpackfocused = true;
        }
        else
        {
            this.backpackfocused = false;
            this.backpackPanel.classList.remove("selected");

        }

    }

    GearsSplitHorizontalQuadMode()
    {
        this.weaponsParentContainer.classList.add("d-none");
        this.gearsParentContainer.classList.remove("d-none");
        this.weaponsArrowUp.classList.remove("d-hidden");
        this.weaponsArrowDown.classList.add("d-hidden");
    }
    WeaponsSplitHorizontalQuadMode()
    {
        this.weaponsParentContainer.classList.remove("d-none");
        this.gearsParentContainer.classList.add("d-none");
        this.weaponsArrowUp.classList.add("d-hidden");
        this.weaponsArrowDown.classList.remove("d-hidden");
    }

    OnMouseLeaveWeaponsContainer()
    {
        // if (this.IsWeaponsContainerFocused) {
        this.IsGearsContainerFocused = false;
        if (this.weaponsParentContainer)
            this.weaponsParentContainer.classList.remove("selected");
        // }
    }

    OnMouseLeaveGearsContainer()
    {
        this.IsGearsContainerFocused = false;
        if (this.gearsParentContainer)
            this.gearsParentContainer.classList.remove("selected")
    }

    FocusWeaponsContainer()
    {
        this.IsWeaponsContainerFocused = true;
        this.weaponsParentContainer.classList.add("selected");
        this.gearsParentContainer.classList.remove("selected");
    }

    FocusGearsContainer()
    {
        this.IsGearsContainerFocused = true;
        this.gearsParentContainer.classList.add("selected")
        this.weaponsParentContainer.classList.remove("selected");
    }

    Event_Deactivate()
    {
        InputMgr.ClearFocusedElement();
        super.Event_Deactivate()
        if (this.inventoryBackpack)
        {
            this.inventoryBackpack.Deactivate();
        }
        this.UnbindInternalEvents();

    }


    // Event_FocusBackpackItem(index) {
    //     if (this.inventoryBackpack) {
    //         this.SelectBackpackItemByIndex(index);
    //     }
    // }

    OnLoadBackpack(element)
    {
        this.inventoryBackpack = element;
        if (this.IsActivated)
        {

            this.inventoryBackpack.Activate();
        }
    }

    OnBackpackSetFocus(focus)
    {

        if (focus)
        {


            if (this.IsBackpackContainerFocused)
                return

            this.IsWeaponsContainerFocused = false;
            this.IsGearsContainerFocused = false;
            this.OnMouseLeaveWeaponsContainer();
            this.OnMouseLeaveGearsContainer();
            if (this.weaponsArrowDown !== undefined)
                this.weaponsArrowDown.classList.add("d-hidden")
            if (this.weaponsArrowUp !== undefined)
                this.weaponsArrowUp.classList.add("d-hidden")
            this.IsBackpackContainerFocused = true;

        } else
        {
            if (!this.IsBackpackContainerFocused)
                return
            this.IsBackpackContainerFocused = false;
        }
    }

    SelectBackpackItemByIndex(index)
    {
        this.OnBackpackSetFocus(true);
    }

    SetContainerFocusIndex(containerIdent, index)
    {
        InputMgr.ExplicitRemoveFocus();
        InputMgr.ResetCache();
        Delay.byFrame(() =>
        {
        	if (containerIdent == "backpack") {
        		// To ensure scroll is set correctly
        		this.inventoryBackpack.SelectBackpackItemByIndex(index);
        	}

            console.log("Focus ", containerIdent, ": ", index);
            InputMgr.FocusGridItemByIndex(this.WidgetIdent, containerIdent, index);
        }, 10);
    }

	// Backpack Sort Actions
    OnClickPrevBackpackSort()
    {
        engine.trigger(this.MakeEventName("Prev_Backpack_Sort"), "", -1);
    }

    OnClickNextBackpackSort()
    {
        engine.trigger(this.MakeEventName("Next_Backpack_Sort"), "", -1);
    }
    // End Backpack Sort Actions

    Event_DataUpdated()
    {
        if (this.DataModel.equipmentdata.bshowgunmagespellslot == true)
        {
            document.getElementById("weapons_gear").dataset.inputLinkRight = "gear_gun_spell";

            let gunMageSlot = document.getElementById("weapons_gear_gun_mage");

            if (gunMageSlot)
            {
                if (gunMageSlot.firstElementChild)
                {
                    gunMageSlot.firstElementChild.dataset.inputId = "gear_gun_spell";
                    
                    gunMageSlot.firstElementChild.dataset.inputElem = true;
                    gunMageSlot.firstElementChild.dataset.inputLinkLeft = "equip_gear_spellmod";
                    gunMageSlot.firstElementChild.dataset.inputLinkRight = "backpack";
                    gunMageSlot.firstElementChild.dataset.inputLinkUp = "equip_gear_amulet";
                }
            }
        }
        else
        {
            document.getElementById("weapons_gear").dataset.inputLinkRight = "backpack";
        }

        if (this.DataModel.secondaryitemcard.visible != this.secondaryitemcardvisible)
        {
            this.secondaryitemcardvisible = this.DataModel.secondaryitemcard.visible;
            this.ShowItemCard();
        }
        if (this.DataModel.primaryitemcard.visible != this.primaryitemcardvisible)
        {
            this.primaryitemcardvisible = this.DataModel.primaryitemcard.visible;
            this.ShowItemCard();
        }
    }

}

// VAZU_MOD: PROPERTY EXPLORER BEGIN
class PropertyExplorerObject
{
    // DataModel to explore
    constructor(dataModel)
    {
        this.DataModel = dataModel;
        this.BackstepSublevel = this.BackstepSublevel.bind(this);
        this.PropertyClicked = this.PropertyClicked.bind(this);
        this.BasePropPath = 'this.DataModel';
        this.AdditionalPropPaths = [];
        this.PropertyExplorerContainer = document.getElementById("PropertyExplorerContainer");
        this.BackButton = document.getElementById("BackButton");
        this.PropertyExplorer = document.getElementById("PropertyExplorer");
        this.PathDisplay = document.getElementById("PathDisplay");
        // A custom object type provided by Prysm. I'm treating this as a normal array for the time being.
        this.ArrayProxyTypeString = 'CoherentArrayProxy';
        this.UpdatePropertyExplorer();
    }
    /** More detailed Type function. Pulled from MDN docs
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
     */
    Type(value) {
        if (value === null) {
            return "null";
        }
        const baseType = typeof value;
        // Primitive types
        if (!["object", "function"].includes(baseType)) {
            return baseType;
        }

        // Symbol.toStringTag often specifies the "display name" of the
        // object's class. It's used in Object.prototype.toString().
        const tag = value[Symbol.toStringTag];
        if (typeof tag === "string") {
            return tag;
        }

        // If it's a function whose source code starts with the "class" keyword
        if (
            baseType === "function" &&
            Function.prototype.toString.call(value).startsWith("class")
        ) {
            return "class";
        }

        // The name of the constructor; for example `Array`, `GeneratorFunction`,
        // `Number`, `String`, `Boolean` or `MyCustomClass`
        const className = value.constructor.name;
        if (typeof className === "string" && className !== "") {
            return className;
        }

        // At this point there's no robust way to get the type of value,
        // so we use the base implementation.
        return baseType;
    }

    FetchCurrentProperty()
    {
        return eval(this.ResolveCurrentPropertyPath());
    }

    ResolveCurrentPropertyPath()
    {
        let fullPropPath = this.BasePropPath;
        for (const path of this.AdditionalPropPaths)
        {
            fullPropPath = `${fullPropPath}${path}`;
        }
        return fullPropPath;
    }

    UpdatePropertyExplorer()
    {
        let fullPropPath = this.BasePropPath;
        for (const path of this.AdditionalPropPaths)
        {
            fullPropPath = `${fullPropPath}${path}`;
        }
        this.PathDisplay.innerHTML = `${this.ResolveCurrentPropertyPath()}`;

        let prop = this.FetchCurrentProperty();

        let basicType = typeof(prop);
        let detailedType = this.Type(prop);

        // We need separate props here because CoherentArrayProxy's return iterators which cannot be reset after iterating.
        let entries = "";
        let loopEntries = ""

        // Special treatment for CoherentArrayProxy objects
        if (detailedType === this.ArrayProxyTypeString)
        {
            entries = prop.entries();
            loopEntries = prop.entries();
        }
        // If it's an object, we get the entries like normal
        else if (basicType === 'object')
        {
            entries = Object.entries(prop);
            loopEntries = Object.entries(prop);
        }
        // If what we are trying to evaluate is undefined, display a notice.
        // Will primarily happen for functions with no return value.
        else if (basicType === 'undefined')
        {
            entries = [['Notice:', 'Value is undefined']];
        }
        // Whatever we are trying to evaluate isn't supported, take it off the stack and return
        else
        {
            this.AdditionalPropPaths.pop();
            return;
        }

        let data = this.GenerateHTMLFromEntries(entries);
        this.PropertyExplorer.innerHTML = data;
        this.BackButton.addEventListener("click", this.BackstepSublevel);
        for (const [key, value] of loopEntries)
        {
            let id = `key_${key}`;
            document.getElementById(id).addEventListener("click", this.PropertyClicked);
        }
    }

    GenerateHTMLFromEntries(entries)
    {
        let ele = "div";
        let cl = `</${ele}>`;
        let data = "";
        for (const [key, value] of entries)
        {
            let basicType = typeof(value);
            let detailedType = this.Type(value);
            let id = `key_${key}`;
            let op = `<${ele} id="${id}">`;
            let val = "";
            // If it's a primitive, we can display it's value.
            if (basicType === 'string' || basicType === 'number' || basicType === 'boolean')
            {
                if (value === '')
                {
                    val = '&ltempty&gt';
                }
                else
                {
                    val = value;
                }
            }
            // If it's a function, display it's required arg count. We can only run 0-arg functions.
            else if (basicType === 'function')
            {
                val = value.length;
            }
            data = `${data} ${op} ${key}: ${detailedType} ${val} ${cl}`;
        }

        return data;
    }

    PropertyClicked(event)
    {
        try {
            let strippedName = event.target.id.replace('key_', '');
            let subProp = this.FetchCurrentProperty()[`${strippedName}`];
            let subPropType = typeof(subProp);

            if (subPropType === 'object')
            {
                this.AdditionalPropPaths.push(`['${strippedName}']`);
                this.UpdatePropertyExplorer();
            }
            // We only support 0-arg function calls
            else if (subPropType === 'function' && subProp.length === 0)
            {
                this.AdditionalPropPaths.push(`.${strippedName}()`);
                this.UpdatePropertyExplorer();
            }
            
        } catch(error) {
            entries = [['Error', error.toString()]];
            let data = this.GenerateHTMLFromEntries(entries);
            this.PropertyExplorer.innerHTML = data;
        }
    }

    BackstepSublevel(event)
    {
        this.AdditionalPropPaths.pop();
        this.UpdatePropertyExplorer();
    }
}
// VAZU_MOD: PROPERTY EXPLORER END

let inventoryArchetype = new Widget_Inventory("inventory", "-archetype-", true);
WidgetMgr.RegisterWidgetClass(inventoryArchetype);