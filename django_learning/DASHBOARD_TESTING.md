// Added to all number fields:
pattern: {
  value: /^[0-9]+$/,
  message: 'Please enter numbers only'
},
onKeyPress={(e) => {
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();  // ✅ Blocks letters from being typed
  }
}}
