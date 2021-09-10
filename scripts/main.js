<script src="//ajax.aspnetcdn.com/ajax/jQuery/jquery-2.0.3.min.js"></script>

Start Month:<input type='text' value='2012/1/1' id='startDate'/>
<br />
End Month:<input type='text' value='2012/12/1' id='endDate'/>
<br />
Start Price:<input type='text' value='100' id='startPrice' />
<br />
<button id='calc'>Calculate</button>
<br />
End Price:<input type='text' value=''  id='endPrice'/>
<br />
<a href="www.statbureau.org">www.statbureau.org</a>

<script type="text/javascript">
    var apiUrl = 'https://www.statbureau.org/calculate-inflation-price-jsonp?jsoncallback=?';

    $('#calc').on('click', function calculate() {
        $.getJSON(apiUrl, {
            country: 'united-states',
            start: $('#startDate').val(),
            end: $('#endDate').val(),
            amount: $('#startPrice').val(),
            format: true
        })
          .done(function (data) {
              $('#endPrice').val(data);
          });
    });
</script>