// showQRCode - uses https://github.com/davidshimjs/qrcodejs

var showQRCode = (function($, QRCode) {
  var qrcode = new QRCode("qrcode", {
          colorDark:'#E51C39',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H,
          width: 220,
          height: 220,
      }),
      qrdata = $("#qrcode-data"),
      qraddress = $("#qraddress"),
      qrlabel = $("#qrlabel"),
      qrnarration = $("#qrnarration");

  function showQRCode(address, label) {

      if(address!==undefined)
          qraddress.val(address);

      if(label!==undefined)
          qrlabel.val(label);

      qrcode.clear();

      var data = "omg:"
               + qraddress.val()
               + "?label="     + qrlabel.val()
               + "&narration=" + qrnarration.val()
               + "&amount=" + unit.parse($("#qramount").val(), $("#qrunit").val());

      qrdata.text(data);

      qrcode.makeCode(data);
  }

  return showQRCode;
})(jQuery, QRCode);

// jQuery initialized
jQuery(function() {
    $("#qramount").on("keydown", unit.keydown).on("paste", unit.paste);
});
