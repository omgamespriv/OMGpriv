/* Send Page */
var sendPage = (function($) {

    'use strict';

    var recipientTemplate = $("#recipient-template")[0].outerHTML,
        recipientID = 0;
    $("#recipient-template").remove(); // No point in keeping it in the DOM....

    function init() {
        toggleCoinControl(false); // TODO: Send correct option value...
        addRecipient();
        changeTransactionType();

        $("#send [name^=transaction_type]").on('change', changeTransactionType);
        $("#send [data-toggle=tab]").on('shown.bs.tab', changeTransactionType);
    }

    function initSendBalance(address) {
        // First Stealth - add to send-balance address
        if (address) {
            if (address.at == 2 && $("#send-balance .pay_to").val() === "") {
                $("#send-balance .pay_to").val(address.address).change();
                $("#send-balance .pay_to").data('address', address.address);
            }
        } else
            $("#send-balance .pay_to").val($("#send-balance .pay_to").data('address')).change();

        return true;
    }

    function toggleCoinControl(enable) {
        if (enable === undefined)
            enable = $(".show-coin-control .btn-cons").hasClass('active');

        $("#coincontrol").toggle(enable);
    }

    function updateCoinControl() {
        if(!$("#coincontrol").is(':visible'))
            return;
        var amount = 0;

        for(var i=0;i<recipients;i++)
            amount += unit.parse($("#amount"+i).val());

        bridge.updateCoinControlAmount(amount);
    }

    function updateCoinControlInfo(quantity, amount, fee, afterfee, bytes, priority, low, change)
    {
        if(!$("#coincontrol").is(':visible'))
            return;

        $("#coincontrol_auto").toggle(quantity === 0);
        $("#coincontrol_labels").toggle(quantity > 0);

        if (quantity > 0)
        {
            $("#coincontrol_quantity").text(quantity);
            $("#coincontrol_amount")  .text(unit.format(amount));
            $("#coincontrol_fee")     .text(unit.format(fee));
            $("#coincontrol_afterfee").text(unit.format(afterfee));
            $("#coincontrol_bytes")   .text("~"+bytes).css("color", (bytes > 10000 ? "red" : null));
            $("#coincontrol_priority").text(priority).css("color", (priority.indexOf("low") == 0 ? "red" : null)); // TODO: Translations of low...
            $("#coincontrol_low")     .text(low).toggle(change).css("color", (low == "yes" ? "red" : null)); // TODO: Translations of low outputs
            $("#coincontrol_change")  .text(unit.format(change)).toggle(change);

            $("label[for='coincontrol_low'],label[for='coincontrol_change']").toggle(change);

        } else
        {
            $("#coincontrol_quantity").text("");
            $("#coincontrol_amount")  .text("");
            $("#coincontrol_fee")     .text("");
            $("#coincontrol_afterfee").text("");
            $("#coincontrol_bytes")   .text("");
            $("#coincontrol_priority").text("");
            $("#coincontrol_low")     .text("");
            $("#coincontrol_change")  .text("");
        }
    }

    function recipientCount() {
        return $("div.recipient").length;
    }

    function addRecipient() {
        $("#recipients").append(((recipientCount() == 0 ? '' : '<hr />') + recipientTemplate.replace(/recipient-template/g, 'recipient[count]')).replace(/\[count\]/g, ++recipientID));

        $("#recipient"+(recipientID).toString()+" [data-title]").tooltip();

        // Don't allow characters in numeric fields
        $("#amount"+(recipientID).toString()).on("keydown", unit.keydown).on("paste",  unit.paste);

        bridge.userAction(['clearRecipients']);
    }

    function addRecipientDetail(address, label, narration, amount) {
        clearRecipients();
        $("#recipient"+(recipientID).toString()+" .pay_to").val(address).change();
        $("#recipient"+(recipientID).toString()+" .pay_to_label").val(label).change();
        $("#recipient"+(recipientID).toString()+" .amount").val(amount).change();
        $("#recipient"+(recipientID).toString()+" .narration").val(narration).change();
        $('[href=#send]').click();
    }

    function clearRecipients() {
        $("#recipients").html("");
        $("#send-balance .amount").val("0").change();
        addRecipient();
        initSendBalance();
    }

    function removeRecipient(recipient) {
        if(recipientCount() <= 1)
            clearRecipients();
        else {
            recipient=$(recipient);

            if(recipient.next('hr').remove().length==0)
                recipient.prev('hr').remove();

            recipient.remove();
            $('#tooltip').remove();
        }
    }

    function suggestRingSize() {
        chainDataPage.updateAnonOutputs();

        var minsize = bridge.info.options.MinRingSize||3,
            maxsize = bridge.info.options.MaxRingSize||32;

        function mature(value, min_owned) {
            if(min_owned == undefined || !$.isNumeric(min_owned))
                min_owned = 1;

            var anonOutput = chainDataPage.anonOutputs[value];

            if(anonOutput)
                return Math.min(anonOutput
                   && anonOutput.owned_mature  >= min_owned
                   && anonOutput.system_mature >= minsize
                   && anonOutput.system_mature, maxsize);
            else
                return 0;
        }

        function getOutputRingSize(output, test, maxsize) {
            switch (output) {
                case 0:
                    return maxsize;
                case 2:
                    return mature(1*test, 2)||getOutputRingSize(++output, test, maxsize);
                case 6:
                    return Math.min(mature(5*test, 1),
                                    mature(1*test, 1))||getOutputRingSize(++output, test, maxsize);
                case 7:
                    return Math.min(mature(4*test, 1),
                                    mature(3*test, 1))||getOutputRingSize(++output, test, maxsize);
                case 8:
                    return Math.min(mature(5*test, 1),
                                    mature(3*test, 1))||getOutputRingSize(++output, test, maxsize);
                case 9:
                    return Math.min(mature(5*test, 1),
                                    mature(4*test, 1))||getOutputRingSize(++output, test, maxsize);
                default:
                    if(output == 10)
                        return mature(test/2, 2);

                    maxsize = Math.max(mature(output*test, 1),mature(1*test, output))||getOutputRingSize(output==1?3:++output, test, maxsize);
            }
            return maxsize;
        }

        function validateRecipient() {
            var test = 1,
                output = 0,
                el = $(this).find('.amount'),
                amount = unit.parse(el.val(), $(this).find(".unit").val());

            $("[name=err"+el.attr('id')+"]").remove();

            while (amount >= test && maxsize >= minsize) {
                output = parseInt((amount / test) % 10);
                try {
                    maxsize = getOutputRingSize(output, test, maxsize);
                } catch(e) {
                    console.log(e);
                } finally {
                    if(!maxsize)
                        maxsize = mature(output*test);

                    test *= 10;
                }
            }

            if(maxsize < minsize) {
                invalid(el);
                el.parent().before("<div name='err"+el.attr('id')+"' class='warning'>Not enough system and or owned outputs for the requested amount. Only <b>"
                         +maxsize+"</b> anonymous outputs exist for coin value: <b>" + unit.format(output*(test/10), $(this).find(".unit")) + "</b></div>");
                el.on('change', function(){$("[name=err"+el.attr('id')+"]").remove();});

                $("#tx_ringsize").show();
                $("#suggest_ring_size").show();

                return;
            }
        }

        if ($("#send-balance").is(":visible"))
            $("#send-balance").each(validateRecipient);
        else
        $("div.recipient").each(validateRecipient);

        $("#ring_size").val(maxsize);
    }

    function sendCoins() {
        var txType = getTransactionType(),
            valid = true;

        bridge.userAction(['clearRecipients']);

        if(bridge.info.options.AutoRingSize && txType > 1)
            suggestRingSize();

        // Takes context of element containing address, amount, etc...
        function validateRecipient() {
            var pay = $(this).find('.pay_to'),
                amount = $(this).find('.amount');

            valid = valid && invalid(pay, bridge.validateAddress(pay.val()));

            if(unit.parse(amount.val()) == 0 && !invalid(amount))
                valid = false;

            if(!valid || !bridge.addRecipient(pay.val(), $(this).find(".pay_to_label").val(), $(this).find(".narration").val(), unit.parse(amount.val(), $(this).find(".unit").val()), txType, $("#ring_size").val()))
                return false;
        }

        if ($("#send-balance").is(":visible"))
            $("#send-balance").each(validateRecipient);
        else
            $("div.recipient").each(validateRecipient); // Send main...

        if(valid && bridge.sendCoins($("#coincontrol").is(":visible"), $("#change_address").val()))
            clearRecipients();
    }

    function changeTransactionType(event) {

        var main = $("#send-main").is(":visible"),
            from_type = $("[name=transaction_type_from]:checked").val();

        if (event && event.target !== $("input#to_account_public")[0] && event.target !== $("input#to_account_private")[0])
            $("input[name=transaction_type_to][value=" + (main ? from_type : (from_type === "public" ? "private" : "public")) + "]").prop('checked', true);

        var to_type = $("[name=transaction_type_to  ]:checked").val(),
            tx_type = getTransactionType();

        $("#spend_omg")   .toggle(from_type === "public");
        $("#spend_omgX").toggle(from_type === "private");

        $("#to_omg")      .toggle(to_type === "public");
        $("#to_omgX")   .toggle(to_type === "private");

        $("#to_balance").toggle(!main);

        // TODO: Fix coin control for OMG -> OMGX
        $(".show-coin-control").toggle(tx_type < 1);
        sendPage.toggleCoinControl(tx_type < 0);
        // End TODO

        var enable_adv = $(".show-advanced-controls .btn-cons").hasClass('active');

        $(".advanced_controls").toggle(enable_adv);

        $("#tx_ringsize,#suggest_ring_size").toggle((bridge.info.options ? bridge.info.options.AutoRingSize != true : true) && tx_type > 1 && enable_adv);
        $("#add_recipient").toggle($("#send-main").is(":visible") && enable_adv);

        if (!enable_adv && !main)
            initSendBalance();
    }

    function getTransactionType() {
        /**
         * TXT_OMG_TO_OMG = 0,
         * TXT_OMG_TO_ANON,
         * TXT_ANON_TO_ANON,
         * TXT_ANON_TO_OMG,
         */
        var from_public = $("[name=transaction_type_from]:checked").val() === "public",
              to_public = $("[name=transaction_type_to  ]:checked").val() === "public";

        if (from_public)
            return +!to_public; // 0 (OMG_TO_OMG) or 1 (OMG_TO_ANON)
        else
            return 2 + to_public; // 2 (ANON_TO_ANON) or 3 (ANON_TO_OMG)
    }

    return {
        init: init,
        initSendBalance: initSendBalance,
        toggleCoinControl: toggleCoinControl,
        addRecipient:addRecipient,
        addRecipientDetail: addRecipientDetail,
        clearRecipients: clearRecipients,
        removeRecipient: removeRecipient,
        suggestRingSize: suggestRingSize,
        sendCoins: sendCoins,
        updateCoinControl: updateCoinControl,
        updateCoinControlInfo: updateCoinControlInfo,
        changeTransactionType: changeTransactionType
    }

})(jQuery)

$(sendPage.init);

