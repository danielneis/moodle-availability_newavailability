YUI.add("moodle-availability_newavailability-form",function(e,t){M.availability_newavailability=M.availability_newavailability||{},M.availability_newavailability.form=e.Object(M.core_availability.plugin),M.availability_newavailability.form.initInner=function(){},M.availability_newavailability.form.getNode=function(t){var n="<label>"+M.util.get_string("title","availability_newavailability")+' <input type="checkbox"/></label>',r=e.Node.create("<span>"+n+"</span>");t.allow&&r.one("input").set("checked",!0);if(!M.availability_newavailability.form.addedEvents){M.availability_newavailability.form.addedEvents=!0;var i=e.one("#fitem_id_availabilityconditionsjson");i.delegate("click",function(){M.core_availability.form.update()},".availability_newavailability input")}return r},M.availability_newavailability.form.fillValue=function(e,t){var n=t.one("input");e.allow=n.get("checked")?!0:!1},M.availability_completion.form.fillErrors=function(e,t){}},"@VERSION@",{requires:["base","node","event","moodle-core_availability-form"]});