function invalid(e, t) {
    return t === !0 ? e.css("background", "").css("color", "") : e.css("background", "#65b72d").css("color", "white"), 1 == t
}

function getAddressForNewChat(e) {
    var t = $("#new-contact-address").val();
    if (t.length > 0) return t;
    if (t = bridge.addressForPubKey(e), t.length > 0) {
        $("#new-contact-address").val(t);
        var a = getContactUsername(t, !0);
        "(no label)" == a && (a = ""), $("#new-contact-name").val(a)
    }
    return t
}

function updateValue(e) {
    function t(t) {
        var n = $(".newval");
        0 !== n.length && e.html(a.replace(s, n.val().trim()))
    }
    var a = e.html(),
        s = void 0 !== e.parent("td").data("label") ? e.parent("td").data("label") : void 0 !== e.parent("td").data("value") ? e.parent("td").data("value") : void 0 !== e.data("label") ? e.data("label") : void 0 !== e.data("value") ? e.data("value") : e.text(),
        n = e.parents(".selected").find(".address"),
        o = e.parents(".selected").find(".addresstype");
    n = n.data("value") ? n.data("value") : n.text(), 1 === o.length && (o = o.data("value") ? o.data("value") : o.text()), "Group" === o && s.replace("group_", ""), e.html('<input class="newval" type="text" onchange="bridge.updateAddressLabel(\'' + n + '\', this.value);" value="' + s + '" size=60 />'), $(".newval").focus().on("contextmenu", function(e) {
        e.stopPropagation()
    }).keyup(function(e) {
        13 == e.keyCode && t(e)
    }), $(document).one("click", t)
}

function updateValueChat(e, t) {
    var a = e.data("value"),
        s = contacts[t];
    return void 0 != s && (e.html('<input class="new_chat_value" type="text" onchange="bridge.updateAddressLabel(\'' + s.address + '\', this.value);" value="' + a + '" size=35 style="display:inline;" />'), $("#chat-header .new_chat_value").focus(), $("#chat-header .new_chat_value").on("contextmenu", function(e) {
        e.stopPropagation()
    }), $("#chat-header .new_chat_value").keypress(function(t) {
        if (13 == t.which) {
            t.preventDefault();
            var a = $("#chat-header .new_chat_value");
            if (void 0 == a || void 0 === a.val()) return !1;
            var s = a.val().trim();
            if (void 0 == s) return !1;
            if (0 === s.length) return !1;
            e.html(s), contacts[current_key].label = s, $("#chat-header").data("value", s), $("#contact-" + current_key + " .contact-info .contact-name").text(s), $("#contact-book-" + current_key + " .contact-info .contact-name").text(s)
        }
    }), $("#chat-header .new_chat_value").click(function(e) {
        e.stopPropagation()
    }), void $(document).one("click", function() {
        var t = $("#chat-header .new_chat_value");
        if (void 0 === typeof t || void 0 === t.val()) return !1;
        var a = t.val().trim();
        return void 0 != a && (e.html(a), contacts[current_key].label = a, $("#chat-header").data("value", a), $("#contact-" + current_key + " .contact-info .contact-name").text(a), void $("#contact-book-" + current_key + " .contact-info .contact-name").text(a))
    }))
}

function connectSignals() {
    bridge.emitPaste.connect(this, pasteValue), bridge.emitTransactions.connect(this, appendTransactions), bridge.emitAddresses.connect(this, appendAddresses), bridge.emitMessages.connect(this, appendMessages), bridge.emitMessage.connect(this, appendMessage), bridge.emitCoinControlUpdate.connect(sendPage, "updateCoinControlInfo"), bridge.triggerElement.connect(this, triggerElement), bridge.emitReceipient.connect(sendPage, "addRecipientDetail"), bridge.networkAlert.connect(this, networkAlert), optionsModel.displayUnitChanged.connect(unit, "setType"), optionsModel.reserveBalanceChanged.connect(overviewPage, "updateReserved"), optionsModel.rowsPerPageChanged.connect(this, "updateRowsPerPage"), optionsModel.visibleTransactionsChanged.connect(this, "visibleTransactions"), walletModel.encryptionStatusChanged.connect(overviewPage, "encryptionStatusChanged"), walletModel.balanceChanged.connect(overviewPage, "updateBalance"), overviewPage.clientInfo(), optionsPage.update(), chainDataPage.updateAnonOutputs(), translateStrings()
}

function triggerElement(e, t) {
    $(e).trigger(t)
}

function updateRowsPerPage(e) {
    $(".footable").each(function() {
        var t = $(this);
        t.hasClass("footable-lookup") || (t.data().pageSize = e, t.trigger("footable_initialize"))
    })
}

function pasteValue(e) {
    $(pasteTo).val(e)
}

function paste(e) {
    pasteTo = e, bridge.paste(), 0 != pasteTo.indexOf("#pay_to") && "#change_address" != pasteTo || base58.check(pasteTo)
}

function copy(e, t) {
    var a = "";
    try {
        a = $(e).text()
    } catch (e) {}
    void 0 != a && void 0 == t || (a = "copy" == t ? e : $(e).attr(t)), bridge.copy(a)
}

function networkAlert(e) {
    $("#network-alert span").text(e).toggle("" !== e)
}

function openContextMenu(e) {
    contextMenus.indexOf(e) === -1 && contextMenus.push(e), void 0 !== e.isOpen && 1 === e.isOpen && (e.isOpen = 0, e.close && e.close());
    for (var t = 0; t < contextMenus.length; ++t) contextMenus[t].isOpen = contextMenus[t] == e ? 1 : 0
}

function receivePageInit() {
    var e = [{
        name: "Copy&nbsp;Address",
        fun: function() {
            copy("#receive .footable .selected .address")
        }
    }, {
        name: "Copy&nbsp;Label",
        fun: function() {
            copy("#receive .footable .selected .label2")
        }
    }, {
        name: "Copy&nbsp;Public&nbsp;Key",
        fun: function() {
            copy("#receive .footable .selected .pubkey")
        }
    }, {
        name: "Edit",
        fun: function() {
            $("#receive .footable .selected .label2.editable").dblclick()
        }
    }];
    $("#receive .footable tbody").on("contextmenu", function(e) {
        $(e.target).closest("tr").click()
    }).contextMenu(e, {
        triggerOn: "contextmenu",
        sizeStyle: "content"
    }), $("#filter-address").on("input", function() {
        var e = $("#receive-table");
        "" === $("#filter-address").val() && e.data("footable-filter").clearFilter(), $("#receive-filter").val($("#filter-address").val() + " " + $("#filter-addresstype").val()), e.trigger("footable_filter", {
            filter: $("#receive-filter").val()
        })
    }), $("#filter-addresstype").change(function() {
        var e = $("#receive-table");
        "" === $("#filter-addresstype").val() && e.data("footable-filter").clearFilter(), $("#receive-filter").val($("#filter-address").val() + " " + $("#filter-addresstype").val()), e.trigger("footable_filter", {
            filter: $("#receive-filter").val()
        })
    })
}

function clearRecvAddress() {
    $("#new-address-label").val(""), $("#new-addresstype").val(1)
}

function addAddress() {
    var e = $("#new-addresstype").val(),
        t = "4" == e ? "group_" + $("#new-address-label").val() : $("#new-address-label").val();
    newAdd = bridge.newAddress(t, e), $("#add-address-modal").modal("hide")
}

function clearSendAddress() {
    $("#new-send-label").val(""), $("#new-send-address").val(""), $("#new-send-address-error").text(""), $("#new-send-address").removeClass("inputError")
}

function addSendAddress() {
    var e, t, a, s;
    if (e = $("#new-send-label").val(), t = $("#new-send-address").val(), a = bridge.getAddressLabel(t), "" !== a) return $("#new-send-address-error").text('Error: address already in addressbook under "' + a + '"'), void $("#new-send-address").addClass("inputError");
    if (s = addSendAddressBackend(e, t), "" === s) {
        var n = bridge.lastAddressError();
        $("#new-send-address-error").text("Error: " + n), $("#new-send-address").addClass("inputError")
    } else updateContact(e, t, t, !1), $("#add-address-modal").modal("hide")
}

function addSendAddressBackend(e, t) {
    return bridge.newAddress(e, 0, t, !0)
}

function addressBookInit() {
    var e = [{
        name: "Copy&nbsp;Address",
        fun: function() {
            copy("#addressbook .footable .selected .address")
        }
    }, {
        name: "Copy&nbsp;Public&nbsp;Key",
        fun: function() {
            copy("#addressbook .footable .selected .pubkey")
        }
    }, {
        name: "Copy&nbsp;Label",
        fun: function() {
            copy("#addressbook .footable .selected .label2")
        }
    }, {
        name: "Edit",
        fun: function() {
            $("#addressbook .footable .selected .label2.editable").dblclick()
        }
    }, {
        name: "Delete",
        fun: function() {
            var e = $("#addressbook .footable .selected .address");
            bridge.deleteAddress(e.text()) && e.closest("tr").remove()
        }
    }];
    $("#addressbook .footable tbody").on("contextmenu", function(e) {
        $(e.target).closest("tr").click()
    }).contextMenu(e, {
        triggerOn: "contextmenu",
        sizeStyle: "content"
    }), $("#filter-addressbook").on("input", function() {
        var e = $("#addressbook-table");
        "" == $("#filter-addressbook").val() && e.data("footable-filter").clearFilter(), $("#addressbook-filter").val($("#filter-addressbook").val() + " " + $("#filter-addressbooktype").val()), e.trigger("footable_filter", {
            filter: $("#addressbook-filter").val()
        })
    }), $("#filter-addressbooktype").change(function() {
        var e = $("#addressbook-table");
        "" == $("#filter-addresstype").val() && e.data("footable-filter").clearFilter(), $("#addressbook-filter").val($("#filter-addressbook").val() + " " + $("#filter-addressbooktype").val()), e.trigger("footable_filter", {
            filter: $("#addressbook-filter").val()
        })
    })
}

function appendAddresses(e) {
    if ("string" == typeof e) {
        if ("[]" == e) return;
        e = JSON.parse(e.replace(/,\]$/, "]"))
    }
    contact_book_list = $("#contact-book-list ul"), e.forEach(function(e) {
        var t = $("#" + e.address),
            a = "S" == e.type ? "#addressbook" : 0 !== e.label.lastIndexOf("group_", 0) ? "#receive" : "#addressbook",
            s = $("#invite-modal-" + e.address),
            n = $("#invite-modal-" + e.address);
        "R" == e.type && sendPage.initSendBalance(e) && e.address.length < 75 && 0 !== e.label.lastIndexOf("group_", 0) && (0 == t.length ? $("#message-from-address").append("<option title='" + e.address + "' value='" + e.address + "'>" + e.label + "</option>") : $("#message-from-address option[value=" + e.address + "]").text(e.label), initialAddress && ($("#message-from-address").prepend("<option title='Anonymous' value='anon' selected>Anonymous</option>"), $(".user-name").text(Name), $(".user-address").text(e.address), initialAddress = !1));
        var o = 4 == e.at || 0 === e.label.lastIndexOf("group_", 0),
            r = "S" == e.type;
        o && (e.at = 4, e.label = e.label.replace("group_", ""), e.label_value = e.label_value.replace("group_", ""), r = !0);
        var i = "n/a" !== e.pubkey;
        if (r && i && (createContact(e.label, e.address, o, !0), appendContact(e.address, !1, !0)), !o && r && i) {
            if (0 == s.length) {
                var l = "<tr id='invite-modal-" + e.address + "' lbl='" + e.label + "'>                   <td style='padding-left:18px;' class='label2' data-value='" + e.label_value + "'>" + e.label + "</td>                   <td class='address'>" + e.address + "</td>                   <td class='invite footable-visible footable-last-column'><input type='checkbox' class='checkbox'></input></td>                   </tr>";
                $("#invite-modal-tbody").append(l)
            } else $("#invite-modal-" + e.address + " .label2").text(e.label);
            if (0 == n.length) {
                var l = "<tr  id='group-modal-" + e.address + "' lbl='" + e.label + "'>                   <td style='padding-left:18px;' class='label2' data-value='" + e.label_value + "'>" + e.label + "</td>                   <td class='address'>" + e.address + "</td>                   <td class='invite footable-visible footable-last-column'><input type='checkbox' class='checkbox'></input></td>                   </tr>";
                $("#group-modal-tbody").append(l)
            } else $("#group-modal-" + e.address + " .label2").text(e.label)
        }
        0 == t.length ? ($(a + " .footable tbody").append("<tr id='" + e.address + "' lbl='" + e.label + "'>                 <td style='padding-left:18px;' class='label2 editable' data-value='" + e.label_value + "'>" + e.label + "</td>                 <td class='address'>" + e.address + "</td>                 <td class='pubkey'>" + e.pubkey + "</td>                 <td class='addresstype'>" + (4 == e.at ? "Group" : 3 == e.at ? "BIP32" : 2 == e.at ? "Stealth" : "Normal") + "</td></tr>"), $("#" + e.address).selection("tr").find(".editable").on("dblclick", function(e) {
            e.stopPropagation(), updateValue($(this))
        }).attr("data-title", "Double click to edit").tooltip()) : ($("#" + e.address + " .label2").data("value", e.label_value).text(e.label), $("#" + e.address + " .pubkey").text(e.pubkey))
    });
    $("#addressbook .footable,#receive .footable").trigger("footable_setup_paging")
}

function addressLookup(e, t, a) {
    function s() {
        $("#address-lookup-filter").val($("#address-lookup-address-filter").val() + " " + $("#address-lookup-address-type").val()), o.trigger("footable_filter", {
            filter: $("#address-lookup-filter").val()
        })
    }
    var n = $((t ? "#receive" : "#addressbook") + " table.footable > tbody").html(),
        o = $("#address-lookup-table");
    o.children("tbody").html(n), o.trigger("footable_initialize"), o.data("footable-filter").clearFilter(), $("#address-lookup-table > tbody tr").selection().on("dblclick", function() {
        var t = e.split(",");
        $("#" + t[0]).val($(this).attr("id").trim()).change(), void 0 !== t[1] && $("#" + t[1]).val($(this).attr("lbl").trim()).text($(this).attr("lbl").trim()).change(), $("#address-lookup-modal").modal("hide")
    }), $("#address-lookup-address-filter").on("input", function() {
        "" == $("#lookup-address-filter").val() && o.data("footable-filter").clearFilter(), s()
    }), $("#address-lookup-address-type").change(function() {
        "" == $("#address-lookup-address-type").val() && o.data("footable-filter").clearFilter(), s()
    }), a && ($("#address-lookup-address-type").val(a), s())
}

function transactionPageInit() {
    var e = [{
        name: "Copy&nbsp;Amount",
        fun: function() {
            copy("#transactions .footable .selected .amount", "data-value")
        }
    }, {
        name: "Copy&nbsp;transaction&nbsp;ID",
        fun: function() {
            copy("#transactions .footable .selected", "id")
        }
    }, {
        name: "Edit&nbsp;label",
        fun: function() {
            $("#transactions .footable .selected .editable").dblclick()
        }
    }, {
        name: "Show&nbsp;transaction&nbsp;details",
        fun: function() {
            $("#transactions .footable .selected").dblclick()
        }
    }];
    $("#transactions .footable tbody").on("contextmenu", function(e) {
        $(e.target).closest("tr").click()
    }).contextMenu(e, {
        triggerOn: "contextmenu",
        sizeStyle: "content"
    }), $("#transactions .footable").on("footable_paging", function(e) {
        var t = filteredTransactions.slice(e.page * e.size);
        t = t.slice(0, e.size);
        var a = $("#transactions .footable tbody");
        a.html(""), delete e.ft.pageInfo.pages[e.page], e.ft.pageInfo.pages[e.page] = t.map(function(e) {
            return e.html = formatTransaction(e), a.append(e.html), $("#" + e.id)[0]
        }), e.result = !0, bindTransactionTableEvents()
    }).on("footable_create_pages", function(e) {
        var t = $("#transactions .footable");
        $(t.data("filter")).val() || (filteredTransactions = Transactions);
        var a = t.data("sorted"),
            s = 1 == t.find("th.footable-sorted").length,
            n = "numeric";
        switch (a) {
            case 0:
                a = "d";
                break;
            case 2:
                a = "t_l", n = "alpha";
                break;
            case 3:
                a = "ad", n = "alpha";
                break;
            case 4:
                a = "n", n = "alpha";
                break;
            case 5:
                a = "am";
                break;
            default:
                a = "c"
        }
        n = e.ft.options.sorters[n], filteredTransactions.sort(function(e, t) {
            return s ? n(e[a], t[a]) : n(t[a], e[a])
        }), delete e.ft.pageInfo.pages, e.ft.pageInfo.pages = [];
        var o = Math.ceil(filteredTransactions.length / e.ft.pageInfo.pageSize),
            r = [];
        if (o > 0) {
            for (var i = 0; i < e.ft.pageInfo.pageSize; i++) r.push([]);
            for (var i = 0; i < o; i++) e.ft.pageInfo.pages.push(r)
        }
    }).on("footable_filtering", function(e) {
        return !!e.clear || void(filteredTransactions = Transactions.filter(function(t) {
            for (var a in t)
                if (t[a].toString().toLowerCase().indexOf(e.filter.toLowerCase()) !== -1) return !0;
            return !1
        }))
    })
}

function formatTransaction(e) {
    return "<tr id='" + e.id + "' data-title='" + e.tt + "'>                    <td data-value='" + e.d + "'>" + e.d_s + "</td>                    <td class='trans-status' data-value='" + e.c + "'><center><i class='fa fa-lg " + e.s + "'></center></td>                    <td class='trans_type'><img height='15' width='15' src='qrc:///assets/icons/tx_" + e.t + ".png' /> " + e.t_l + "</td>                    <td class='address' style='color:" + e.a_c + ";' data-value='" + e.ad + "' data-label='" + e.ad_l + "'><span class='editable'>" + e.ad_d + "</span></td>                    <td class='trans-nar'>" + e.n + "</td>                    <td class='amount' style='color:" + e.am_c + ";' data-value='" + e.am_d + "'>" + e.am_d + "</td>                 </tr>"
}

function visibleTransactions(e) {
    "*" !== e[0] && (Transactions = Transactions.filter(function(e) {
        return this.some(function(e) {
            return e == this
        }, e.t_l)
    }, e))
}

function bindTransactionTableEvents() {
    $("#transactions .footable tbody tr").tooltip().on("click", function() {
        $(this).addClass("selected").siblings("tr").removeClass("selected")
    }).on("dblclick", function(e) {
        $(this).attr("href", "#transaction-info-modal"), $("#transaction-info-modal").appendTo("body").modal("show"), $("#transaction-info").html(bridge.transactionDetails($(this).attr("id"))), $(this).click(), $(this).off("click"), $(this).on("click", function() {
            $(this).addClass("selected").siblings("tr").removeClass("selected")
        })
    }).find(".editable").on("dblclick", function(e) {
        e.stopPropagation(), e.preventDefault(), updateValue($(this))
    }).attr("data-title", "Double click to edit").tooltip()
}

function appendTransactions(e) {
    if ("string" == typeof e) {
        if ("[]" == e) return;
        e = JSON.parse(e.replace(/,\]$/, "]"))
    }
    1 == e.length && e[0].id == -1 || (e.sort(function(e, t) {
        return e.d = parseInt(e.d), t.d = parseInt(t.d), t.d - e.d
    }), Transactions = Transactions.filter(function(e) {
        return 0 == this.some(function(e) {
            return e.id == this.id
        }, e)
    }, e).concat(e), overviewPage.recent(e.slice(0, 7)), $("#transactions .footable").trigger("footable_redraw"))
}

function chatInit() {
    var e = [{
        name: "Send&nbsp;Omg",
        fun: function() {
            clearRecipients(), $("#pay_to0").val($("#contact-list .selected .contact-address").text()), $("#navpanel [href=#send]").click()
        }
    }, {
        name: "Copy&nbsp;Address",
        fun: function() {
            copy("#contact-list .selected .contact-address")
        }
    }, {
        name: "Private&nbsp;Message",
        fun: function() {
            $("#message-text").focus()
        }
    }];
    $("#contact-list").on("contextmenu", function(e) {
        $(e.target).closest("li").click()
    }).contextMenu(e, {
        triggerOn: "contextmenu",
        sizeStyle: "content"
    }), e = [{
        name: "Copy&nbsp;Selected",
        fun: function() {
            var e = $("#message-text")[0];
            "undefined" != typeof e.selectionStart && copy(e.value.substring(e.selectionStart, e.selectionEnd), "copy")
        }
    }, {
        name: "Paste",
        fun: function() {
            paste("#pasteTo");
            var e = $("#message-text")[0];
            "undefined" != typeof e.selectionStart ? e.value = e.value.substring(e.selectionStart, 0) + $("#pasteTo").val() + e.value.substring(e.selectionStart) : e.value += $("#pasteTo").val()
        }
    }], $("#message-text").contextMenu(e, {
        triggerOn: "contextmenu",
        sizeStyle: "content"
    }), $("#message-text").keypress(function(e) {
        if (13 == e.which && !e.shiftKey) {
            if (e.preventDefault(), "" == $("#message-text").val()) return 0;
            removeNotificationCount(), sendMessage()
        }
    }), $("#messages").selection().on("click", function(e) {
        "" !== current_key && removeNotificationCount(current_key)
    }), $("#contact-list").on("mouseover", function() {
        contactScroll.refresh()
    }), $("#contact-group-list").on("mouseover", function() {
        contactGroupScroll.refresh()
    }), $("#contact-book-list").on("mouseover", function() {
        contactBookScroll.refresh()
    })
}

function appendMessages(e, t) {
    if (contact_list = $("#contact-list ul"), contact_group_list = $("#contact-group-list ul"), t) {
        for (var a in contacts) contacts[a].messages.length > 0 && (contacts[a].messages = []);
        $("#chat-menu-link .details").hide(), contact_list.html(""), contact_group_list.html(""), $("#contact-list").removeClass("in-conversation"), $("#contact-group-list").removeClass("in-conversation"), $(".contact-discussion ul").html(""), $(".user-notifications").hide(), $("#message-count").text(0), messagesScroller.scrollTo(0, 0), contactScroll.scrollTo(0, 0), contactGroupScroll.scrollTo(0, 0), contactBookScroll.scrollTo(0, 0), $("#invite-group-btn").hide(), $("#leave-group-btn").hide()
    }
    if (void 0 != e) {
        if (e.forEach(function(e) {
                appendMessage(e.id, e.type, e.sent_date, e.received_date, e.label_from_role, e.label_from, e.label_to, e.to_address, e.from_address, e.read, e.message, t)
            }), t) {
            console.log("resetting"), cleanUpAfterCurrentKey(), current_key = "";
            var s;
            for (var n in contacts) {
                var s = n;
                break
            }
            openConversation(contacts[s].address, !1), setTimeout(function() {
                scrollMessages(!0)
            }, 200)
        }
        $(contacts[current_key].group ? "#contact-group-list" : "#contact-list").addClass("in-conversation")
    }
}

function appendMessage(e, t, a, s, n, o, r, i, l, c, d, u) {
    var p, f = "S" == t ? i : l,
        g = "S" == t ? l : i,
        v = "S" == t ? "(no label)" == r ? g : r : "(no label)" == o ? f : o,
        m = f,
        b = "S" == t ? g : f,
        h = !1;
    if (0 === r.lastIndexOf("group_", 0) ? (p = r.replace("group_", ""), h = !0, m = g) : 0 === n.lastIndexOf("group_", 0) ? (p = n.replace("group_", ""), h = !0, m = f, b = g) : p = v, 0 === d.lastIndexOf("/invite", 0) && d.length >= 60) {
        var k = d.match(/[Te][1-9A-HJ-NP-Za-km-z]{50,51}/g),
            y = d.substring(61, d.length).replace(/[^A-Za-z0-9\s!?]/g, "");
        if (null != k) {
            if ("R" == t) return c || addInvite(k, y, e), !1;
            (t = "S") && (d = "An invite for group " + y + " has been sent.")
        } else 0 == y.length ? y = f + "_" + String(k).substring(1, 5) : null == k && (d = "The group invitation was a malconfigured private key.")
    }
    createContact(p, m, h), h && (createContact(v, f, !1, !1), addContactToGroup(b, m));
    var w = contacts[m];
    0 == $.grep(w.messages, function(t) {
        return t.id == e
    }).length && (w.messages.push({
        id: e,
        them: f,
        self: g,
        label_msg: v,
        key_msg: b,
        group: h,
        message: d,
        type: t,
        sent: a,
        received: s,
        read: c
    }), w.messages.sort(function(e, t) {
        return e.received - t.received
    }), appendContact(m, !1), current_key != m || u || loadNewMessage(m), prependContact(m), "R" == t && 0 == c && addNotificationCount(m, 1))
}

function createContact(e, t, a, s) {
    var n = contacts[t],
        o = getContactUsername(t);
    void 0 == contacts[t] && (contacts[t] = {}, n = contacts[t], n.key = t, n.label = o, n.address = t, n.group = a, n.addressbook = void 0 != s && s, n.title = isStaticVerified(t) ? verified_list[t].title : a ? "Untrusted" : n.addressbook ? "Verified" : "Unverified", n.avatar_type = 0, n.avatar = "", n.messages = [], n.mesage_height, a && (n.contacts = []))
}

function addContactToGroup(e, t) {
    return void 0 != contacts[t] && (void 0 != contacts[e] && (!existsContactInGroup(e, t) && (contacts[t].contacts.push(e), !0)))
}

function existsContact(e) {
    return void 0 != contacts[e]
}

function existsContactInGroup(e, t) {
    return !contacts[t].contacts.indexOf(e) == -1
}

function updateContact(e, t, a, s) {
    s = s !== !1;
    var n = contacts[t];
    void 0 !== n && (void 0 !== a && t != a || (a = ""), n.messages.forEach(function(s) {
        "R" !== s.type || s.them !== t && s.them !== a || (s.label_msg = e)
    }), "" === a ? (contacts[t].label = e, $("#contact-book-" + t + " .contact-info .contact-name").text(e), $("#contact-" + t + " .contact-info .contact-name").text(e)) : ($("#contact-book-" + a + " .contact-info .contact-name").text(e), $("#contact-" + a + " .contact-info .contact-name").text(e)), openConversation && openConversation(t, !0))
}

function appendContact(e, t, a) {
    var s = a ? "contact-book-" : "contact-",
        n = $("#" + s + e),
        o = contacts[e];
    if (0 === n.length) {
        var r = "";
        void 0 === o.messages[0] || a || (r = o.messages[0].message);
        var i = "<li id='" + s + e + "' class='contact' data-title='" + o.label + "'>                <span class='contact-info'>                    <span class='contact-name'>" + (o.group && a ? "<i class='fa fa-users' style='padding-right: 7px;'></i>" : "") + o.label + "</span>                    <span class='" + (a ? "contact-address" : "contact-message") + "'>" + (a ? o.address : r) + "</span>                </span>                <span class='contact-options'>                        <span class='message-notifications'>0</span> <span class='delete' onclick='deleteMessages(\"" + e + "\")'><i class='fa fa-minus-circle'></i></span>                        </span></li>";
        a ? (contact_book_list.append(i), $("#" + s + e).find(".delete").hide()) : o.group ? contact_group_list.append(i) : contact_list.append(i), n = $("#" + s + e).selection("li").on("dblclick", function(t) {
            openConversation(e, !0), prependContact(e)
        }).on("click", function(t) {
            openConversation(e, !0)
        }), a && n.on("click", function(e) {}), n.find(".delete").on("click", function(e) {
            e.stopPropagation()
        }), n.find(".message-notifications").hide()
    } else void 0 === o.messages || a || $("#" + s + e + " .contact-info .contact-message").text(o.messages[o.messages.length - 1].message);
    t && openConversation(e, !1)
}

function getContactUsername(e, t) {
    var a;
    return "object" == typeof verified_list[e] ? verified_list[e].username : (a = bridge.getAddressLabel(e), "string" == typeof a && "" != a ? a.replace("group_", "") : void 0 != t ? "" : e)
}

function isStaticVerified(e) {
    return "object" == typeof verified_list[e]
}

function allowCustomAvatar(e) {
    return "object" == typeof verified_list[e] && "boolean" == typeof verified_list[e].custom_avatar && verified_list[e].custom_avatar
}

function getIconTitle(e) {
    return "unverified" == e ? "fa fa-cross " : "verified" == e ? "fa fa-check " : "contributor" == e ? "fa fa-cog " : "omgteam" == e ? "fa fa-code " : ""
}

function addNotificationCount(e, t) {
    if (void 0 == contacts[e]) return !1;
    var a = $("#contact-" + e).find(".message-notifications"),
        s = a.html();
    a.text(parseInt(s) + parseInt(t)).show(), $("#chat-menu-link .details").show(), $(".user-notifications").show(), $("#message-count").text(parseInt($("#message-count").text()) + 1).show(), $("#contact-" + e).prependTo(contacts[e].group ? "#contact-group-list ul" : "#contact-list ul")
}

function removeNotificationCount(e) {
    void 0 == e && "" !== current_key && (e = current_key), messagesScroller.refresh();
    var t = contacts[e];
    if (void 0 == t) return !1;
    var a = $("#contact-" + e).find(".message-notifications"),
        s = a.html();
    if (0 == a.text()) return !1;
    a.text(0), a.hide();
    var n = $("#message-count"),
        o = parseInt(n.text()) - s;
    if (n.text(o), 0 == o ? (n.hide(), $("#chat-menu-link .details").hide()) : n.show(), 0 == t.messages.length) return 0;
    for (var r = t.messages.length; r--;) t.messages[r].read || bridge.markMessageAsRead(t.messages[r].id)
}

function openConversation(e, t) {
    t && $("#chat-menu-link").click();
    var a = contacts[e];
    current_key != e && (cleanUpAfterCurrentKey(), loadMessages(e)), current_key = e;
    var s = a.group;
    s ? $("#invite-group-btn").show() : ($("#invite-group-btn").hide(), $("#leave-group-btn").hide()), $("#chat-header").text(a.label).addClass("editable"), $("#chat-header").data("value", a.label), $("#chat-header").off(), $("#chat-header").on("dblclick", function(e) {
        e.stopPropagation(), updateValueChat($(this), a.key)
    }).attr("data-title", "Double click to edit").tooltip(), t && removeNotificationCount(a.key)
}

function loadMessages(e) {
    void 0 == e && (e = current_key);
    var t = ($(".contact-discussion ul"), contacts[e]),
        a = 50,
        s = !1,
        n = messagesScroller.maxScrollY;
    void 0 == contacts[e].message_height && (s = !0, contacts[e].message_height = t.messages.length);
    var o = $("<span class='message-block'></span>").insertAfter(".contact-discussion ul .load-more-messages");
    contacts[e].message_height > a ? (contacts[e].message_height = contacts[e].message_height - a, showLoadMoreMessagesButton()) : (a = contacts[e].message_height, contacts[e].message_height = 0, hideLoadMoreMessagesButton());
    for (var r = t.message_height; r < t.message_height + a;) loadMessageByIndex(e, r, o), getOurAddress(e, !0), r++;
    0 == t.messages.length && ($(".contact-discussion ul").html("<li id='remove-on-send'>Starting Conversation with " + t.label + " - " + t.address + "</li><span class='load-more-messages' onclick='loadMessages()' style='display: none;'><a class='btn-danger btn btn-cons'>Load more messages</a></span><span class='message-block'></span>"), $("#message-to-address").val(t.address)), s ? scrollMessages() : scrollMessagesTo(n)
}

function processMessageForDisplay(e) {
    return micromarkdown.parse(emojione.toImage(e))
}

function loadMessage(e, t) {
    var a = new Date(1e3 * e.sent),
        s = new Date(1e3 * e.received);
    addAvatar(e.them);
    var n;
    n = void 0 != contacts[e.key_msg] ? contacts[e.key_msg].label : getContactUsername(e.key_msg);
    var o = (n == e.key_msg ? " data-toggle=\"modal\" data-target=\"#add-address-modal\" onclick=\"clearSendAddress(); $('#add-rcv-address').hide(); $('#add-send-address').show(); $('#new-send-address').val('" + e.key_msg + "')\" " : "", $("<li class='message-wrapper " + ("S" == e.type ? "my-message" : "other-message") + "'>                <span class='message-content'>                    <span class='info'>" + getAvatar("S" == e.type ? e.self : e.them) + "</span>                    <span class='user-name'>" + n + "                    </span>                    <span class='title'>                    </span>                    <span class='timestamp'>" + ((a.getHours() < 10 ? "0" : "") + a.getHours() + ":" + (a.getMinutes() < 10 ? "0" : "") + a.getMinutes() + ":" + (a.getSeconds() < 10 ? "0" : "") + a.getSeconds()) + "</span>                       <div id='" + e.id + "'><span class='first-message'>" + processMessageForDisplay(e.message) + "</span></div>                </span>             </li>").appendTo(t));
    o.find(".timestamp").attr("data-title", "Sent: " + a.toLocaleString() + "\n Received: " + s.toLocaleString()).tooltip(), n == e.key_msg && o.find(".user-name").attr("data-toggle", "modal").attr("data-target", "#add-address-modal").on("click", function() {
        clearSendAddress(), $("#add-rcv-address").hide(), $("#add-send-address").show(), $("#new-send-address").val(e.key_msg)
    }), o.find("#" + e.id).append(createMessageDeleteButton()), o.find("#" + e.id + " .delete").on("click", function() {
        deleteMessages(current_key, e.id)
    }), o.find("#" + e.id).hover(function() {
        $(this).find(".delete").show()
    }, function() {
        $(this).find(".delete").hide()
    }), o.find(".delete").hover(function() {
        $("#" + e.id).addClass("message-text-selected")
    }, function() {
        $("#" + e.id).removeClass("message-text-selected")
    }), insertTitleHTML(o, e.key_msg), o.find(".user-name").attr("data-title", "" + e.key_msg).tooltip()
}

function loadMessageByIndex(e, t, a) {
    var s, n = contacts[e],
        o = n.messages[t];
    return t > n.message_height && (s = n.messages[t - 1], checkIfWeNeedToCombineMessages(s, o)) ? combineMessages(s, o) : void loadMessage(o, a)
}

function loadNewMessage(e) {
    var t = $(".contact-discussion ul .message-block:last");
    loadMessageByIndex(e, contacts[e].messages.length - 1, t), scrollMessages()
}

function cleanUpAfterCurrentKey() {
    hideLoadMoreMessagesButton(), $(".contact-discussion ul").html("<span class='load-more-messages' style='width: 100%; display: block;' onclick='loadMessages()'><a class='btn-danger btn btn-cons' style='width: 20%; margin-left: 40%;'>Load more messages</a></span> <span class='message-block'></span>"), "" != current_key && (contacts[current_key].message_height = void 0)
}

function hideLoadMoreMessagesButton() {
    $(".contact-discussion ul .load-more-messages").hide()
}

function showLoadMoreMessagesButton() {
    $(".contact-discussion ul .load-more-messages").show()
}

function getOurAddress(e, t) {
    if (!existsContact(e)) return !1;
    var a = contacts[e],
        s = a.group;
    if (0 == a.messages.length) return !1;
    var n = !1;
    return a.messages.some(function(a, o) {
        if (!s || "S" == a.type) return t && setSenderAndReceiver(a.self, e), n = a.self, !0
    }), n
}

function setSenderAndReceiver(e, t) {
    $("#message-from-address").val(e), $("#message-to-address").val(t)
}

function insertTitleHTML(e, t) {
    if (!existsContact(t)) return !1;
    var a = (contacts[t], contacts[t].title.toLowerCase());
    e.find(".title").addClass(getIconTitle(a) + a + "-mark"), e.find(".title").hover(function() {
        $(this).text(" " + a)
    }, function() {
        $(this).text("")
    })
}

function confirmConversationOpenLink() {
    return confirm("Are you sure you want to open this link?\n\nIt will leak your IP address and other browser metadata, the least we can do is advice you to copy the link and open it in a _Tor Browser_ instead.\n\n You can disable this message in options.")
}

function confirmConversationShowImage(e) {
    if (!confirm("Are you sure you want to view this image?\n\nIt will leak your IP address and other browser metadata, the least we can do is advice you to copy the link and open it in a _Tor Browser_ instead.")) return !1;
    var t = $(e).data("src");
    $(e).load(iscrollReload), $(e).attr("src", t)
}

function checkIfWeNeedToCombineMessages(e, t) {
    return e.type == t.type && ("R" == t.type && e.them == t.them || "S" == t.type && e.self == t.self)
}

function combineMessages(e, t) {
    var a = new Date(1e3 * t.sent),
        s = $("<div><span class='combined-message-timestamp'>" + (a.getHours() < 10 ? "0" : "") + a.getHours() + ":" + (a.getMinutes() < 10 ? "0" : "") + a.getMinutes() + "</span><span class='combined-message'></span></div>").insertAfter($("#" + e.id)).attr("id", t.id).append(createMessageDeleteButton()).hover(function() {
            $(this).find(".delete").show()
        }, function() {
            $(this).find(".delete").hide()
        });
    return s.find(".delete").hover(function() {
        $("#" + t.id).addClass("message-text-selected")
    }, function() {
        $("#" + t.id).removeClass("message-text-selected")
    }).on("click", function() {
        deleteMessages(current_key, t.id)
    }), s.find(".combined-message").append(processMessageForDisplay(t.message)), s.hover(function() {
        $("#" + t.id + " .combined-message-timestamp").css("visibility", "visible")
    }, function() {
        $("#" + t.id + " .combined-message-timestamp").css("visibility", "hidden")
    }), !0
}

function createMessageDeleteButton() {
    return "<span class='delete'><i class='fa fa-minus-circle'></i></span>"
}

function addRandomAvatar(e) {
    return !!existsContact(e) && (contacts[e].avatar_type = 1, void(contacts[e].avatar = generateRandomAvatar(e)))
}

function generateRandomAvatar(e) {
    var t = new jsSHA("SHA-512", "TEXT");
    t.update(e);
    var a = t.getHash("HEX"),
        s = new Identicon(a, 40).toString();
    return '<img width=40 height=40 src="data:image/png;base64,' + s + '">'
}

function addCustomAvatar(e) {
    contacts[e].avatar_type = 2, contacts[e].avatar = '<img width=40 height=40 src="qrc:///assets/img/avatars/' + contacts[e].label + '.png">'
}

function addAvatar(e) {
    allowCustomAvatar(e) ? addCustomAvatar(e) : addRandomAvatar(e)
}

function getAvatar(e) {
    return allowCustomAvatar(e) ? '<img width=40 height=40 src="qrc:///assets/img/avatars/' + verified_list[e].username + '.png">' : existsContact(e) ? contacts[e].avatar : generateRandomAvatar(e)
}

function prependContact(e) {
    var t = contacts[e];
    t.group ? ($("#contact-group-list").addClass("in-conversation"), $("#contact-" + e).prependTo($("#contact-group-list ul"))) : ($("#contact-list").addClass("in-conversation"), $("#contact-" + e).prependTo($("#contact-list ul")))
}

function createGroupChat() {
    var e = $("#new-group-name").val();
    if ("" == e) return !1;
    $("#filter-new-group").text(""), $("#new-group-modal").modal("hide");
    var t = bridge.createGroupChat(e);
    inviteGroupChat(t), createContact(e, t, !0), appendContact(t, !0, !1)
}

function addInvite(e, t, a) {
    return 0 == $("#invite-" + e + "-" + a).length && void $("#group-invite-list").append("<div id='invite-" + e + "-" + a + '\'><a class=\'group-invite\'><i class="fa fa-envelope"></i><span class="group-invite-label"> ' + t + ' </span><i class="fa fa-check group-invite-check" onclick=\'acceptInvite("' + e + '","' + t + '", "' + a + '");\'></i><i class="fa fa-close group-invite-close" onclick=\'deleteInvite("' + e + '","' + a + "\");'></i></a></div>");
}

function deleteInvite(e, t) {
    bridge.deleteMessage(t), $("#invite-" + e + "-" + t).html("")
}

function acceptInvite(e, t, a) {
    deleteInvite(e, a);
    var s = bridge.joinGroupChat(e, t);
    return "false" !== s && (updateContact(t, s), createContact(t, s, !0), void appendContact(s, !0, !1))
}

function inviteGroupChat(e) {
    var t = [],
        a = "#invite-modal-tbody";
    void 0 != e ? a = "#group-modal-tbody" : e = current_key, $(a + " tr").each(function() {
        var e = $(this).find(".address").text(),
            a = $(this).find(".invite .checkbox").is(":checked");
        a && (t.push(e), $(this).find(".invite .checkbox").attr("checked", !1))
    });
    var s = [];
    t.length > 0 && (s = bridge.inviteGroupChat(e, t, $("#message-from-address").val()))
}

function leaveGroupChat() {
    var e = bridge.leaveGroupChat(current_key);
    return e
}

function openInviteModal() {
    if (0 == current_key.length) return !1;
    var e = bridge.getAddressLabel(current_key).replace("group_", "");
    $("#existing-group-name").val(e)
}

function submitInviteModal() {
    inviteGroupChat(), $("#invite-to-group-modal").hide()
}

function scrollMessages(e) {
    var t = messagesScroller.y,
        a = messagesScroller.maxScrollY;
    messagesScroller.refresh();
    var s = function(t, a) {
        var s = messagesScroller.maxScrollY;
        (a > s && a == t || void 0 != e && e) && messagesScroller.scrollTo(0, messagesScroller.maxScrollY, 100)
    };
    setTimeout(s(t, a), 100)
}

function scrollMessagesTo(e) {
    messagesScroller.refresh(), messagesScroller.scrollTo(0, messagesScroller.maxScrollY - e, 100)
}

function openNewConversationModal() {
    var e = $("#new-contact-address").val(),
        t = $("#new-contact-name").val();
    return 1 == $("#contact-" + e).length ? (bridge.getAddressLabel(e) != t && addSendAddressBackend(t, e), setTimeout(function() {
        updateContact(t, e), openConversation(e, !1), cleanNewConversationModal()
    }, 500), closeNewConversationModal()) : (createContact(t, e, !1), result = bridge.newAddress(t, 0, e, !0), "" === result && "Duplicate Address." !== bridge.lastAddressError() ? void $("#new-contact-address").css("background", "#E51C39").css("color", "white") : ($("#new-contact-address").css("background", "").css("color", ""), bridge.setPubKey($("#new-contact-address").val(), $("#new-contact-pubkey").val()), bridge.updateAddressLabel($("#new-contact-address").val(), $("#new-contact-name").val()), $("#new-contact-modal").modal("hide"), $("#message-to-address").val($("#new-contact-address").val()), $("#message-text").focus(), $("#contact-list ul li").removeClass("selected"), $("#contact-list").addClass("in-conversation"), $("#contact-group-list ul li").removeClass("selected"), $("#contact-group-list").addClass("in-conversation"), closeNewConversationModal(), openPickSenderMsgAddrModal(), !0))
}

function closeNewConversationModal() {
    return $("#new-contact-modal").modal("hide"), !0
}

function cleanNewConversationModal() {
    $("#new-contact-address").val(""), $("#new-contact-name").val(""), $("#new-contact-pubkey").val("")
}

function openPickSenderMsgAddrModal() {
    var e = "<option title='Please select and address to send from' value='none'>Select identity</option>" + $("#message-from-address").html();
    $("#pick-sender-msg-selector").html(e), $("#pick-sender-msg-modal").modal("show")
}

function startNewConversation() {
    console.log("startNewConversation");
    var e = $("#pick-sender-msg-selector").val();
    if ("none" == e) return alert("Please select an address."), !1;
    $("#message-from-address").val(e);
    var t = $("#new-contact-address").val();
    openConversation(t, !0), closePickSenderMsgAddrModal()
}

function closePickSenderMsgAddrModal() {
    cleanNewConversationModal(), $("#pick-sender-msg-modal").modal("hide")
}

function sendMessage() {
    $("#remove-on-send").remove(), bridge.sendMessage(current_key, $("#message-text").val(), $("#message-from-address").val()) && $("#message-text").val("")
}

function deleteMessages(e, t) {
    var a = contacts[e];
    if (!confirm("Are you sure you want to delete " + (void 0 == t ? "these messages?" : "this message?"))) return !1;
    var s = $("#message-count");
    parseInt(s.text());
    removeNotificationCount(e), void 0 == t && (cleanUpAfterCurrentKey(), current_key = "");
    for (var n = 0; n < a.messages.length; n++)
        if (void 0 === t) {
            if (!bridge.deleteMessage(a.messages[n].id)) return !1;
            $("#" + a.messages[n].id).remove(), a.messages.splice(n, 1), n--
        } else if (a.messages[n].id === t) {
        if (bridge.deleteMessage(t)) {
            $("#" + t).remove(), a.messages.splice(n, 1), n--;
            break
        }
        return !1
    }
    0 == a.messages.length ? ($("#contact-" + e).remove(), $("#contact-list").removeClass("in-conversation"), $("#contact-group-list").removeClass("in-conversation")) : (iscrollReload(), openConversation(e, !1))
}

function signMessage() {
    $("#sign-signature").val("");
    var e, t, a, s = "";
    e = $("#sign-address").val().trim(), t = $("#sign-message").val().trim();
    var n = bridge.signMessage(e, t);
    return a = n.error_msg, s = n.signed_signature, "" !== a ? ($("#sign-result").removeClass("green"), $("#sign-result").addClass("red"), $("#sign-result").html(a), !1) : ($("#sign-signature").val(n.signed_signature), $("#sign-result").removeClass("red"), $("#sign-result").addClass("green"), $("#sign-result").html("Message signed successfully"), void 0)
}

function verifyMessage() {
    var e, t, a, s = "";
    e = $("#verify-address").val().trim(), t = $("#verify-message").val().trim(), s = $("#verify-signature").val().trim();
    var n = bridge.verifyMessage(e, t, s);
    return a = n.error_msg, "" !== a ? ($("#verify-result").removeClass("green"), $("#verify-result").addClass("red"), $("#verify-result").html(a), !1) : ($("#verify-result").removeClass("red"), $("#verify-result").addClass("green"), $("#verify-result").html("Message verified successfully"), void 0)
}

function iscrollReload(e) {
    contactScroll.refresh(), contactGroupScroll.refresh(), contactBookScroll.refresh(), messagesScroller.refresh(), e === !0 && messagesScroller.scrollTo(0, messagesScroller.maxScrollY, 0)
}

function editorCommand(e, t) {
    var a, s, n, o, r = $("#message-text")[0];
    o = r.scrollTop, r.focus(), "undefined" != typeof r.selectionStart ? (a = r.selectionStart, s = r.selectionEnd, n = e.length, t && (e += r.value.substring(a, s) + t), r.value = r.value.substring(0, a) + e + r.value.substring(s, r.value.length), r.selectionStart = a + e.length - (t ? t.length : 0), r.selectionEnd = r.selectionStart) : r.value += e + t, r.scrollTop = o, r.focus()
}

function setupWizard(e) {
    var t = $("#" + e + " > div");
    backbtnjs = '$("#key-options").show(); $("#wizards").hide();', fwdbtnjs = 'gotoWizard("new-key-wizard", 1);', $("#" + e).prepend("<div id='backWiz' style='display:none;' class='btn btn-default btn-cons wizardback' onclick='" + backbtnjs + "' >Back</div>"), $("#" + e).prepend("<div id='fwdWiz'  style='display:none;' class='btn btn-default btn-cons wizardfwd'  onclick='" + fwdbtnjs + "' >Next Step</div>"), t.each(function(e) {
        $(this).addClass("step" + e), $(this).hide(), $("#backWiz").hide()
    })
}

function gotoWizard(section, step, runStepJS) {
    var sections = $("#wizards > div");
    if (validateJS = $("#" + section + " .step" + (step - 1)).attr("validateJS"), runStepJS && void 0 !== validateJS) {
        var valid = eval(validateJS);
        if (!valid) return !1
    }
    sections.each(function(e) {
        $(this).hide()
    });
    var steps = $("#" + section + " > div[class^=step]"),
        gotoStep = step;
    null == gotoStep && (gotoStep = 0), 0 == gotoStep ? ($("#" + section + " #backWiz").attr("onclick", '$(".wizardback").hide(); $("#wizards").show();'), $("#" + section + " #fwdWiz").attr("onclick", '$(".wizardback").hide(); gotoWizard("' + section + '", 1, true);'), $("#backWiz").hide()) : ($("#" + section + " #backWiz").attr("onclick", 'gotoWizard("' + section + '", ' + (gotoStep - 1) + " , false);"), $("#" + section + " #fwdWiz").attr("onclick", 'gotoWizard("' + section + '", ' + (gotoStep + 1) + " , true);")), endWiz = $("#" + section + " .step" + step).attr("endWiz"), void 0 !== endWiz && "" !== endWiz && $("#" + section + " #fwdWiz").attr("onclick", endWiz), steps.each(function(e) {
        $(this).hide()
    }), $("#" + section).show(), stepJS = $("#" + section + " .step" + gotoStep).attr("stepJS"), runStepJS && void 0 !== stepJS && eval(stepJS), $("#" + section + " .step" + gotoStep).fadeIn(0)
}

function dumpStrings() {
    function e(e) {
        return 'QT_TRANSLATE_NOOP("OmgBridge", "' + e + '"),\n'
    }
    var t = "";
    $(".translate").each(function(a) {
        var s = e($(this).text().trim());
        t.indexOf(s) == -1 && (t += s)
    }), $("[data-title]").each(function(a) {
        var s = e($(this).attr("data-title").trim());
        t.indexOf(s) == -1 && (t += s)
    }), console.log(t)
}

function translateStrings() {
    $(".translate").each(function(e) {
        var t = $(this).text();
        $(this).text(t.replace(t, bridge.translateHtmlString(t.trim())))
    }), $("[data-title]").each(function(e) {
        var t = $(this).attr("data-title");
        $(this).attr("data-title", t.replace(t, bridge.translateHtmlString(t.trim())))
    })
}
var breakpoint = 906;
$(function() {
    $(".footable,.footable-lookup").footable({
        breakpoints: {
            phone: 480,
            tablet: 700
        },
        delay: 50
    }).on({
        footable_breakpoint: function() {},
        footable_row_expanded: function(e) {
            var t = $(this).find(".editable");
            t.off("dblclick").on("dblclick", function(e) {
                e.stopPropagation(), updateValue($(this))
            }).attr("data-title", "Double click to edit").tooltip()
        }
    }), $(".editable").on("dblclick", function(e) {
        e.stopPropagation(), updateValue($(this))
    }).attr("data-title", "Double click to edit %column%"), window.onresize = function(e) {
        window.innerWidth > breakpoint && $("#layout").removeClass("active")
    }, bridge && $("[href='#about']").on("click", function() {
        bridge.userAction(["aboutClicked"])
    }), overviewPage.init(), receivePageInit(), transactionPageInit(), addressBookInit(), chatInit(), chainDataPage.init(), walletManagementPage.init(), $(".footable > tbody tr").selection()
}), $.fn.selection = function(e) {
    return e || (e = "tr"), this.on("click", function() {
        $(this).addClass("selected").siblings(e).removeClass("selected")
    })
};
var base58 = {
        base58Chars: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
        check: function(e) {
            for (var t = $(e), a = t.val(), s = 0, n = a.length; s < n; ++s)
                if (base58.base58Chars.indexOf(a[s]) == -1) return t.css("background", "#E51C39").css("color", "white"), !1;
            return t.css("background", "").css("color", ""), !0
        }
    },
    pasteTo = "",
    unit = {
        type: 0,
        name: "OMG",
        display: "OMG",
        setType: function(e) {
            switch (this.type = void 0 == e ? 0 : e, e) {
                case 1:
                    this.name = "mOMG", this.display = "mOMG";
                    break;
                case 2:
                    this.name = "uOMG", this.display = "&micro;OMG";
                    break;
                case 3:
                    this.name = "sOMG", this.display = "Omglet";
                    break;
                default:
                    this.name = this.display = "OMG"
            }
            $("td.unit,span.unit,div.unit").html(this.display), $("select.unit").val(e).trigger("change"), $("input.unit").val(this.name), overviewPage.updateBalance()
        },
        format: function(e, t) {
            var a = $.isNumeric(e) ? null : $(e);
            switch (t = void 0 == t ? this.type : parseInt(t), e = parseInt(void 0 == a ? e : void 0 == a.data("value") ? a.val() : a.data("value")), t) {
                case 1:
                    e /= 1e5;
                    break;
                case 2:
                    e /= 100;
                    break;
                case 3:
                    break;
                default:
                    e /= 1e8
            }
            return e = e.toFixed(this.mask(t)), void 0 == a ? e : void a.val(e)
        },
        parse: function(e, t) {
            var a = $.isNumeric(e) ? null : $(e);
            t = void 0 == t ? this.type : parseInt(t), fp = void 0 == a ? e : a.val(), void 0 == fp || fp.length < 1 ? fp = ["0", "0"] : "." == fp[0] ? fp = ["0", fp.slice(1)] : fp = fp.split("."), e = parseInt(fp[0]);
            var s = this.mask(t);
            if (s > 0 && (e *= Math.pow(10, s)), s > 0 && fp.length > 1) {
                for (var n = fp[1].split(""); n.length > 1 && "0" == n[n.length - 1];) n.pop();
                var o = parseInt(n.join(""));
                o > 0 && (s -= n.length, s > 0 && (o *= Math.pow(10, s)), e += o)
            }
            return void 0 == a ? e : (a.data("value", e), void this.format(a, t))
        },
        mask: function(e) {
            switch (e = void 0 == e ? this.type : parseInt(e)) {
                case 1:
                    return 5;
                case 2:
                    return 2;
                case 3:
                    return 0;
                default:
                    return 8
            }
        },
        keydown: function(e) {
            var t = e.which,
                a = $(e.target).siblings(".unit").val();
            if (190 == t || 110 == t) return this.value.toString().indexOf(".") === -1 && 0 != unit.mask(a) || e.preventDefault(), !0;
            if (e.shiftKey || !(t >= 96 && t <= 105 || t >= 48 && t <= 57)) 8 == t || 9 == t || 17 == t || 46 == t || 45 == t || t >= 35 && t <= 40 || e.ctrlKey && (65 == t || 67 == t || 86 == t || 88 == t) || e.preventDefault();
            else {
                var s = this.selectionStart,
                    n = this.value.indexOf(".");
                if ("Range" !== document.getSelection().type && s > n && this.value.indexOf(".") !== -1 && this.value.length - 1 - n >= unit.mask(a)) {
                    if ("0" == this.value[this.value.length - 1] && s < this.value.length) return this.value = this.value.slice(0, -1), this.selectionStart = s, void(this.selectionEnd = s);
                    e.preventDefault()
                }
            }
        },
        paste: function(e) {
            var t = e.originalEvent.clipboardData.getData("text/plain");
            (!$.isNumeric(t) || this.value.indexOf(".") !== -1 && "Range" !== document.getSelection().type) && e.preventDefault()
        }
    },
    contextMenus = [],
    overviewPage = {
        init: function() {
            this.balance = $(".balance"), this.omgXBal = $(".omgX_balance"), this.reserved = $("#reserved"), this.stake = $("#stake"), this.unconfirmed = $("#unconfirmed"), this.immature = $("#immature"), this.total = $("#total")
        },
        updateBalance: function(e, t, a, s, n) {
            void 0 == e ? (e = this.balance.data("orig"), t = this.omgXBal.data("orig"), a = this.stake.data("orig"), s = this.unconfirmed.data("orig"), n = this.immature.data("orig")) : (this.balance.data("orig", e), this.omgXBal.data("orig", t), this.stake.data("orig", a), this.unconfirmed.data("orig", s), this.immature.data("orig", n)), this.formatValue("balance", e), this.formatValue("omgXBal", t), this.formatValue("stake", a), this.formatValue("unconfirmed", s), this.formatValue("immature", n), this.formatValue("total", e + a + s + n + t)
        },
        updateReserved: function(e) {
            this.formatValue("reserved", e)
        },
        formatValue: function(e, t) {
            if ("total" === e && void 0 !== t && !isNaN(t)) {
                var a = unit.format(t).split(".");
                $("#total-big > span:first-child").text(a[0]), $("#total-big .cents").text(a[1])
            }
            if ("stake" === e && void 0 !== t && !isNaN(t)) {
                0 == t ? $("#staking-big").addClass("not-staking") : $("#staking-big").removeClass("not-staking");
                var a = unit.format(t).split(".");
                $("#staking-big > span:first-child").text(a[0]), $("#staking-big .cents").text(a[1])
            }
            e = this[e], 0 == t ? (e.html(""), e.parent("tr").hide()) : (e.text(unit.format(t)), e.parent("tr").show())
        },
        recent: function(e) {
            for (var t = 0; t < e.length; t++) overviewPage.updateTransaction(e[t]);
            $("#recenttxns [data-title]").tooltip()
        },
        updateTransaction: function(e) {
            var t = function(e) {
                    return "<tr><td class='text-left' style='border-top: 1px solid rgba(230, 230, 230, 0.7);border-bottom: none;'><center><label style='margin-top:6px;' class='label label-important inline fs-12'>" + ("input" == e.t ? "Received" : "output" == e.t ? "Sent" : "inout" == e.t ? "In-Out" : "Stake") + "</label></center></td><td class='text-left' style='border-top: 1px solid rgba(230, 230, 230, 0.7);border-bottom: none;'><center><a id='" + e.id.substring(0, 17) + "' data-title='" + e.tt + "' href='#' onclick='$(\"#navitems [href=#transactions]\").click();$(\"#" + e.id + "\").click();'> " + unit.format(e.am) + " " + unit.display + " </a></center></td><td style='border-top: 1px solid rgba(230, 230, 230, 0.7);border-bottom: none;'><span class='overview_date' data-value='" + e.d + "'><center>" + e.d_s + "</center></span></td></tr>"
                },
                a = e.id.substring(0, 17);
            if (0 == $("#" + a).attr("data-title", e.tt).length) {
                for (var s = $("#recenttxns tr"), n = t(e), o = !1, r = 0; r < s.length; r++) {
                    var i = $(s[r]);
                    if (parseInt(e.d) > parseInt(i.find(".overview_date").data("value"))) {
                        i.before(n), o = !0;
                        break
                    }
                }
                for (o || $("#recenttxns").append(n), s = $("#recenttxns tr"); s.length > 8;) $("#recenttxns tr:last").remove(), s = $("#recenttxns tr")
            }
        },
        clientInfo: function() {
            $("#version").text(bridge.info.build.replace(/\-[\w\d]*$/, "")), $("#clientinfo").attr("data-title", "Build Desc: " + bridge.info.build + "\nBuild Date: " + bridge.info.date).tooltip()
        },
        encryptionStatusChanged: function(e) {
            switch (e) {
                case 0:
                case 1:
                case 2:
            }
        }
    },
    optionsPage = {
        init: function() {},
        update: function() {
            function e(e) {
                e = $(this);
                var t = e.prop("checked"),
                    a = e.data("linked");
                if (a) {
                    a = a.split(" ");
                    for (var s = 0; s < a.length; s++) {
                        var n = $("#" + a[s] + ",[for=" + a[s] + "]").attr("disabled", !t);
                        t ? n.removeClass("disabled") : n.addClass("disabled")
                    }
                }
            }
            var t = bridge.info.options;
            $("#options-ok,#options-apply").addClass("disabled");
            for (var a in t) {
                var s = $("#opt" + a),
                    n = t[a],
                    o = t["opt" + a];
                if (0 != s.length) {
                    if (o) {
                        s.html("");
                        for (var r in o)
                            if ("string" == typeof r && $.isArray(o[r]) && !$.isNumeric(r)) {
                                s.append("<optgroup label='" + r[0].toUpperCase() + r.slice(1) + "'>");
                                for (var i = 0; i < o[r].length; i++) s.append("<option>" + o[r][i] + "</option>")
                            } else s.append("<option" + ($.isNumeric(r) ? "" : " value='" + r + "'") + ">" + o[r] + "</option>")
                    }
                    s.is(":checkbox") ? (s.prop("checked", n === !0 || "true" === n), s.off("change"), s.on("change", e), s.change()) : s.is("select[multiple]") && "*" === n ? s.find("option").attr("selected", !0) : s.val(n), s.one("change", function() {
                        $("#options-ok,#options-apply").removeClass("disabled")
                    })
                } else a.indexOf("opt") == -1 && console.log("Option element not available for %s", a)
            }
        },
        save: function() {
            var e = bridge.info.options,
                t = {};
            for (var a in e) {
                var s = $("#opt" + a),
                    n = e[a],
                    o = !1;
                null != n && "false" != n || (n = !1), 0 != s.length && (s.is(":checkbox") ? o = s.prop("checked") : s.is("select[multiple]") ? (o = s.val(), null === o && (o = "*")) : o = s.val(), n != o && n.toString() !== o.toString() && (t[a] = o))
            }
            $.isEmptyObject(t) || (bridge.userAction({
                optionsChanged: t
            }), optionsPage.update(), t.hasOwnProperty("AutoRingSize") && changeTxnType())
        }
    },
    Name = "You",
    initialAddress = !0,
    Transactions = [],
    filteredTransactions = [],
    contacts = {},
    contact_list, contact_group_list, contact_book_list, current_key = "",
    verified_list = {
        oNhqJiB81JMqKTQ8EjE4UCH7E5NtY8QoX4: {
            username: "OMG",
            title: "OMG",
            custom_avatar: !1
        }
    },
    contactScroll = new IScroll("#contact-list", {
        mouseWheel: !0,
        lockDirection: !0,
        scrollbars: !0,
        interactiveScrollbars: !0,
        scrollbars: "custom",
        scrollY: !0,
        scrollX: !1,
        preventDefaultException: {
            tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|P|SPAN)$/
        }
    }),
    contactGroupScroll = new IScroll("#contact-group-list", {
        mouseWheel: !0,
        lockDirection: !0,
        scrollbars: !0,
        interactiveScrollbars: !0,
        scrollbars: "custom",
        scrollY: !0,
        scrollX: !1,
        preventDefaultException: {
            tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|P|SPAN)$/
        }
    }),
    contactBookScroll = new IScroll("#contact-book-list", {
        mouseWheel: !0,
        lockDirection: !0,
        scrollbars: !0,
        interactiveScrollbars: !0,
        scrollbars: "custom",
        scrollY: !0,
        scrollX: !1,
        preventDefaultException: {
            tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|P|SPAN)$/
        }
    }),
    messagesScroller = new IScroll(".contact-discussion", {
        mouseWheel: !0,
        lockDirection: !0,
        scrollbars: !0,
        interactiveScrollbars: !0,
        scrollbars: "custom",
        scrollY: !0,
        scrollX: !1,
        preventDefaultException: {
            tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|P|SPAN)$/
        }
    }),
    chainDataPage = {
        anonOutputs: {},
        init: function() {
            $("#show-own-outputs,#show-all-outputs").on("click", function(e) {
                $(e.target).hide().siblings("a").show()
            }), $("#show-own-outputs").on("click", function() {
                $("#chaindata .footable tbody tr>td:first-child+td").each(function() {
                    0 == $(this).text() && $(this).parents("tr").hide()
                })
            }), $("#show-all-outputs").on("click", function() {
                $("#chaindata .footable tbody tr:hidden").show()
            })
        },
        updateAnonOutputs: function() {
            chainDataPage.anonOutputs = bridge.listAnonOutputs();
            var e = $("#chaindata .footable tbody");
            e.html("");
            for (value in chainDataPage.anonOutputs) {
                var t = chainDataPage.anonOutputs[value];
                e.append("<tr>                    <td data-value=" + value + ">" + t.value_s + "</td>                    <td>" + t.owned_outputs + (t.owned_outputs == t.owned_mature ? "" : " (<b>" + t.owned_mature + "</b>)") + "</td>                    <td>" + t.system_outputs + " (" + t.system_mature + ")</td>                    <td>" + t.system_spends + "</td>                    <td>" + t.least_depth + "</td>                </tr>")
            }
            $("#chaindata .footable").trigger("footable_initialize")
        }
    },
    blockExplorerPage = {
        blockHeader: {},
        findBlock: function(e) {
            if ("" === e || null === e) blockExplorerPage.updateLatestBlocks();
            else {
                if (blockExplorerPage.foundBlock = bridge.findBlock(e), "" !== blockExplorerPage.foundBlock.error_msg) return $("#latest-blocks-table  > tbody").html(""), $("#block-txs-table > tbody").html(""), $("#block-txs-table").addClass("none"), alert(blockExplorerPage.foundBlock.error_msg), !1;
                var t = $("#latest-blocks-table  > tbody");
                t.html("");
                var a = $("#block-txs-table  > tbody");
                a.html(""), $("#block-txs-table").addClass("none"), t.append("<tr data-value=" + blockExplorerPage.foundBlock.block_hash + ">                                     <td>" + blockExplorerPage.foundBlock.block_hash + "</td>                                     <td>" + blockExplorerPage.foundBlock.block_height + "</td>                                     <td>" + blockExplorerPage.foundBlock.block_timestamp + "</td>                                     <td>" + blockExplorerPage.foundBlock.block_transactions + "</td>                        </tr>"), blockExplorerPage.prepareBlockTable()
            }
        },
        updateLatestBlocks: function() {
            blockExplorerPage.latestBlocks = bridge.listLatestBlocks();
            var e = $("#block-txs-table  > tbody");
            e.html(""), $("#block-txs-table").addClass("none");
            var t = $("#latest-blocks-table  > tbody");
            t.html("");
            for (value in blockExplorerPage.latestBlocks) {
                var a = blockExplorerPage.latestBlocks[value];
                t.append("<tr data-value=" + a.block_hash + ">                         <td>" + a.block_hash + "</td>                         <td>" + a.block_height + "</td>                         <td>" + a.block_timestamp + "</td>                         <td>" + a.block_transactions + "</td>                         </tr>")
            }
            blockExplorerPage.prepareBlockTable()
        },
        prepareBlockTable: function() {
            $("#latest-blocks-table  > tbody tr").selection().on("click", function() {
                var e = $(this).attr("data-value").trim();
                blockExplorerPage.blkTxns = bridge.listTransactionsForBlock(e);
                var t = $("#block-txs-table  > tbody");
                t.html("");
                for (value in blockExplorerPage.blkTxns) {
                    var a = blockExplorerPage.blkTxns[value];
                    t.append("<tr data-value=" + a.transaction_hash + ">                                    <td>" + a.transaction_hash + "</td>                                    <td>" + a.transaction_value + "</td>                                    </tr>")
                }
                $("#block-txs-table").removeClass("none"), $("#block-txs-table > tbody tr").selection().on("dblclick", function(t) {
                    $("#blkexp-txn-modal").appendTo("body").modal("show"), selectedTxn = bridge.txnDetails(e, $(this).attr("data-value").trim()), "" == selectedTxn.error_msg && ($("#txn-hash").html(selectedTxn.transaction_hash), $("#txn-size").html(selectedTxn.transaction_size), $("#txn-rcvtime").html(selectedTxn.transaction_rcv_time), $("#txn-minetime").html(selectedTxn.transaction_mined_time), $("#txn-blkhash").html(selectedTxn.transaction_block_hash), $("#txn-reward").html(selectedTxn.transaction_reward), $("#txn-confirmations").html(selectedTxn.transaction_confirmations), $("#txn-value").html(selectedTxn.transaction_value), $("#error-msg").html(selectedTxn.error_msg), selectedTxn.transaction_reward > 0 ? ($("#lbl-reward-or-fee").html("<strong>Reward</strong>"), $("#txn-reward").html(selectedTxn.transaction_reward)) : ($("#lbl-reward-or-fee").html("<strong>Fee</strong>"), $("#txn-reward").html(selectedTxn.transaction_reward * -1)));
                    var a = $("#txn-detail-inputs > tbody");
                    a.html("");
                    for (value in selectedTxn.transaction_inputs) {
                        var s = selectedTxn.transaction_inputs[value];
                        a.append("<tr data-value=" + s.input_source_address + ">                                                   <td>" + s.input_source_address + "</td>                                                   <td>" + s.input_value + "</td>                                                </tr>")
                    }
                    var n = $("#txn-detail-outputs > tbody");
                    n.html("");
                    for (value in selectedTxn.transaction_outputs) {
                        var o = selectedTxn.transaction_outputs[value];
                        n.append("<tr data-value=" + o.output_source_address + ">                                                 <td>" + o.output_source_address + "</td>                                                 <td>" + o.output_value + "</td>                                            </tr>")
                    }
                    $(this).click().off("click").selection()
                }).find(".editable")
            }).on("dblclick", function(e) {
                $("#block-info-modal").appendTo("body").modal("show"), selectedBlock = bridge.blockDetails($(this).attr("data-value").trim()), selectedBlock && ($("#blk-hash").html(selectedBlock.block_hash), $("#blk-numtx").html(selectedBlock.block_transactions), $("#blk-height").html(selectedBlock.block_height), $("#blk-type").html(selectedBlock.block_type), $("#blk-reward").html(selectedBlock.block_reward), $("#blk-timestamp").html(selectedBlock.block_timestamp), $("#blk-merkleroot").html(selectedBlock.block_merkle_root), $("#blk-prevblock").html(selectedBlock.block_prev_block), $("#blk-nextblock").html(selectedBlock.block_next_block), $("#blk-difficulty").html(selectedBlock.block_difficulty), $("#blk-bits").html(selectedBlock.block_bits), $("#blk-size").html(selectedBlock.block_size), $("#blk-version").html(selectedBlock.block_version), $("#blk-nonce").html(selectedBlock.block_nonce)), $(this).click().off("click").selection()
            }).find(".editable")
        }
    },
    walletManagementPage = {
        init: function() {
            setupWizard("new-key-wizard"), setupWizard("recover-key-wizard"), setupWizard("open-key-wizard")
        },
        newMnemonic: function() {
            var e = bridge.getNewMnemonic($("#new-account-passphrase").val(), $("#new-account-language").val()),
                t = e.error_msg,
                a = e.mnemonic;
            "" !== t ? alert(t) : $("#new-key-mnemonic").val(a)
        },
        compareMnemonics: function() {
            var e = $("#new-key-mnemonic").val().trim(),
                t = $("#validate-key-mnemonic").val().trim();
            return e == t ? ($("#validate-key-mnemonic").removeClass("red"), $("#validate-key-mnemonic").val(""), !0) : ($("#validate-key-mnemonic").addClass("red"), alert("The recovery phrase you provided does not match the recovery phrase that was generated earlier - please go back and check to make sure you have copied it down correctly."), !1)
        },
        gotoPage: function(e) {
            $("#navitems a[href='#" + e + "']").trigger("click")
        },
        prepareAccountTable: function() {
            $("#extkey-account-table  > tbody tr").selection().on("click", function() {
                var e = $("#extkey-table > tbody > tr");
                e.removeClass("selected")
            })
        },
        updateAccountList: function() {
            walletManagementPage.accountList = bridge.extKeyAccList();
            var e = $("#extkey-account-table  > tbody");
            e.html("");
            for (value in walletManagementPage.accountList) {
                var t = walletManagementPage.accountList[value];
                e.append("<tr data-value=" + t.id + " active-flag=" + t.active + ">                         <td>" + t.id + "</td>                         <td>" + t.label + "</td>                         <td>" + t.created_at + '</td>                         <td class="center-margin"><i style="font-size: 1.2em; margin: auto;" ' + ("true" == t.active ? 'class="fa fa-circle green-circle"' : 'class="fa fa-circle red-circle"') + ' ></i></td>                         <td style="font-size: 1em; margin-bottom: 6px;">' + (void 0 !== t.default_account ? "<i class='center fa fa-check'></i>" : "") + "</td>                         </tr>")
            }
            walletManagementPage.prepareAccountTable()
        },
        prepareKeyTable: function() {
            $("#extkey-table  > tbody tr").selection().on("click", function() {
                var e = $("#extkey-account-table > tbody > tr");
                e.removeClass("selected")
            })
        },
        updateKeyList: function() {
            walletManagementPage.keyList = bridge.extKeyList();
            var e = $("#extkey-table  > tbody");
            e.html("");
            for (value in walletManagementPage.keyList) {
                var t = walletManagementPage.keyList[value];
                e.append("<tr data-value=" + t.id + " active-flag=" + t.active + ">                         <td>" + t.id + "</td>                         <td>" + t.label + "</td>                         <td>" + t.path + '</td>                         <td><i style="font-size: 1.2em; margin: auto;" ' + ("true" == t.active ? 'class="fa fa-circle green-circle"' : 'class="fa fa-circle red-circle"') + ' ></i></td>                         <td style="font-size: 1em; margin-bottom: 6px;">' + (void 0 !== t.current_master ? "<i class='center fa fa-check'></i>" : "") + "</td>                         </tr>")
            }
            walletManagementPage.prepareKeyTable()
        },
        newKey: function() {
            if (result = bridge.importFromMnemonic($("#new-key-mnemonic").val().trim(), $("#new-account-passphrase").val().trim(), $("#new-account-label").val().trim(), $("#new-account-bip44").prop("checked")), "" !== result.error_msg) return alert(result.error_msg), !1
        },
        recoverKey: function() {
            return result = bridge.importFromMnemonic($("#recover-key-mnemonic").val().trim(), $("#recover-passphrase").val().trim(), $("#recover-account-label").val().trim(), $("#recover-bip44").prop("checked"), 1443657600), "" === result.error_msg || (alert(result.error_msg), !1)
        },
        setMaster: function() {
            var e = $("#extkey-table tr.selected");
            return e.length ? (selected = $("#extkey-table tr.selected").attr("data-value").trim(), void 0 === selected || "" === selected ? (alert("Select a key from the table to set a Master."), !1) : (result = bridge.extKeySetMaster(selected), "" !== result.error_msg ? (alert(result.error_msg), !1) : void walletManagementPage.updateKeyList())) : (alert("Please select a key to set it as master."), !1)
        },
        setDefault: function() {
            var e = $("#extkey-account-table tr.selected");
            return e.length ? (selected = $("#extkey-account-table tr.selected").attr("data-value").trim(), void 0 === selected || "" === selected ? (alert("Select an account from the table to set a default."), !1) : (result = bridge.extKeySetDefault(selected), "" !== result.error_msg ? (alert(result.error_msg), !1) : void walletManagementPage.updateAccountList())) : (alert("Please select an account to set it as default."), !1)
        },
        changeActiveFlag: function() {
            var e = !1,
                t = $("#extkey-account-table tr.selected"),
                a = $("#extkey-table tr.selected");
            return t.length || a.length ? (t.length ? (selected = t.attr("data-value").trim(), active = t.attr("active-flag").trim(), e = !0) : (selected = a.attr("data-value").trim(), active = a.attr("active-flag").trim()), void 0 === selected || "" === selected ? (alert("Please select an account or key to change the active status."), !1) : (result = bridge.extKeySetActive(selected, active), "" !== result.error_msg ? (alert(result.error_msg), !1) : void(e ? walletManagementPage.updateAccountList() : walletManagementPage.updateKeyList()))) : (alert("Please select an account or key to change the active status."), !1)
        }
    };
