const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

// The submit handler puts image_url inside newProduct. We need to extract it and save it separately.
code = code.replace(`
      const newProduct = {
        title: formData.title,
        title_np: formData.title_np || null,
        slug: formData.slug || formData.title.toLowerCase().replace(/\\s+/g, '-'),
        regular_price: parseFloat(formData.regular_price) || 0,
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        category_id: formData.category_id || null,
        description: formData.description || null,
        image_url: formData.image_url || null,
        is_active: formData.is_active
      };`,
`      const newProduct = {
        title: formData.title,
        title_np: formData.title_np || null,
        slug: formData.slug || formData.title.toLowerCase().replace(/\\s+/g, '-'),
        regular_price: parseFloat(formData.regular_price) || 0,
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        category_id: formData.category_id || null,
        description: formData.description || null,
        is_active: formData.is_active
      };
      
      const imageUrl = formData.image_url || null;`);

code = code.replace(`
      if (editingId) {
        const { error } = await supabase.from('products').update(newProduct).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([newProduct]);
        if (error) throw error;
      }`,
`
      let productId = editingId;
      if (editingId) {
        const { error } = await supabase.from('products').update(newProduct).eq('id', editingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('products').insert([newProduct]).select();
        if (error) throw error;
        productId = data[0].id;
      }
      
      if (imageUrl && productId) {
        // Upsert into product_images
        const { data: existingImages } = await supabase.from('product_images').select('id').eq('product_id', productId);
        if (existingImages && existingImages.length > 0) {
          await supabase.from('product_images').update({ url: imageUrl }).eq('id', existingImages[0].id);
        } else {
          await supabase.from('product_images').insert([{ product_id: productId, url: imageUrl }]);
        }
      }
`);

fs.writeFileSync('src/pages/admin/Products.tsx', code);
