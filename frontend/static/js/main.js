
$(document).ready(function() {
    const API_ENDPOINT = '/api/v1.0/minify';

    const $form = $('#shortenForm');
    const $input = $('#urlInput');
    const $result = $('#result');
    const $submitBtn = $('#submitBtn');
    const $timingDisplay = $('#timingDisplay');
    const $timingNumber = $('#timingNumber');
    const $speedMessage = $('#speedMessage');

    let startTime = 0;

    $form.on('submit', function(e) {
        e.preventDefault();

        let longUrl = $input.val().trim();

        // Normalize and validate URL
        const normalizedUrl = normalizeUrl(longUrl);
        if (!normalizedUrl) {
            showError('Please enter a valid URL (e.g., example.com or https://example.com)');
            return;
        }

        // Update the input field with the normalized URL
        $input.val(normalizedUrl);
        longUrl = normalizedUrl;

        setLoading(true);
        clearResult();
        hideTiming();

        // Record start time
        startTime = performance.now();

        $.ajax({
            url: API_ENDPOINT,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ url: longUrl }),
            timeout: 10000
        })
            .done(function(data) {
                const endTime = performance.now();
                const duration = Math.round(endTime - startTime);

                if (data && data.minified_url) {
                    showResult(data.minified_url);
                    showTiming(duration);
                } else {
                    showError('Invalid response from server');
                }
            })
            .fail(function(xhr, status, error) {
                let message = 'Something went wrong';

                if (status === 'timeout') {
                    message = 'Request timed out';
                } else if (xhr.status === 422) {
                    try {
                        const errorData = JSON.parse(xhr.responseText);
                        if (errorData.detail && Array.isArray(errorData.detail)) {
                            message = errorData.detail[0].msg || 'Invalid URL format';
                        } else {
                            message = 'Invalid URL format';
                        }
                    } catch (e) {
                        message = 'Invalid URL format';
                    }
                } else if (xhr.status === 429) {
                    try {
                        const errorData = JSON.parse(xhr.responseText);
                        message = errorData.error || 'Rate limit exceeded. Please try again later.';
                    } catch (e) {
                        message = 'Rate limit exceeded. Please try again later.';
                    }
                } else if (xhr.status >= 500) {
                    message = 'Server error. Please try again.';
                } else if (!navigator.onLine) {
                    message = 'No internet connection';
                } else if (xhr.status === 0) {
                    message = 'Network error. Check your connection.';
                }

                showError(message);
            })
            .always(function() {
                setLoading(false);
            });
    });

    function normalizeUrl(url) {
        if (!url) return null;

        url = url.trim();

        if (/^https?:\/\//i.test(url)) {
            return isValidUrlWithProtocol(url) ? url : null;
        }

        let normalizedUrl;

        if (/^localhost(:\d+)?(\/.*)?$/i.test(url)) {
            normalizedUrl = 'http://' + url;
        }
        else if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?(\/.*)?$/.test(url)) {
            normalizedUrl = 'http://' + url;
        }
        else if (/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i.test(url)) {
            normalizedUrl = 'https://' + url;
        }
        else if (/^www\./i.test(url)) {
            normalizedUrl = 'https://' + url;
        }
        else {
            return null;
        }

        return isValidUrlWithProtocol(normalizedUrl) ? normalizedUrl : null;
    }

    function isValidUrlWithProtocol(url) {
        return /^https?:\/\/[^\s\/$.?#].[^\s]*$/i.test(url) ||
            /^https?:\/\/localhost(:\d+)?(\/.*)?$/i.test(url) ||
            /^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?(\/.*)?$/i.test(url);
    }

    function setLoading(loading) {
        $submitBtn.prop('disabled', loading);
        $input.prop('disabled', loading);

        if (loading) {
            $submitBtn.html('<span class="spinner"></span> Shortening...');
        } else {
            $submitBtn.html('<span>Shorten</span>');
            $input.focus();
        }
    }

    function showResult(shortUrl) {
        const $link = $('<a>', {
            href: shortUrl,
            text: shortUrl,
            class: 'short-url',
            target: '_blank',
            rel: 'noopener noreferrer'
        });

        const $copyBtn = $('<button>', {
            class: 'copy-btn',
            text: 'Copy',
            click: function() { copyToClipboard(shortUrl, $(this)); }
        });

        $result.empty().append($link, $copyBtn);
    }

    function showError(message) {
        $result.html('<span class="error">' + message + '</span>');
        setTimeout(clearResult, 5000);
    }

    function clearResult() {
        $result.empty();
    }

    function showTiming(duration) {
        $timingNumber.text('0');
        $timingDisplay.addClass('show');

        let current = 0;
        const increment = Math.ceil(duration / 15);
        const timer = setInterval(function() {
            current += increment;
            if (current >= duration) {
                current = duration;
                clearInterval(timer);
            }
            $timingNumber.text(current);
        }, 40);
    }

    function hideTiming() {
        $timingDisplay.removeClass('show');
        $speedMessage.text('');
    }

    function copyToClipboard(text, $btn) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(function() {
                    $btn.addClass('success').text('Copied!');
                    setTimeout(function() {
                        $btn.removeClass('success').text('Copy');
                    }, 2000);
                })
                .catch(function() {
                    fallbackCopy(text, $btn);
                });
        } else {
            fallbackCopy(text, $btn);
        }
    }

    function fallbackCopy(text, $btn) {
        const $temp = $('<textarea>').val(text).css({
            position: 'fixed',
            top: '-1000px'
        });

        $('body').append($temp);
        $temp[0].select();

        try {
            document.execCommand('copy');
            $btn.addClass('success').text('Copied!');
            setTimeout(function() {
                $btn.removeClass('success').text('Copy');
            }, 2000);
        } catch (err) {
            $btn.text('Error');
            setTimeout(function() {
                $btn.text('Copy');
            }, 2000);
        }

        $temp.remove();
    }
});