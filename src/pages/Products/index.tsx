// src/pages/Products/index.tsx
import React, { useEffect, useState } from "react";
import { getBatchStatus, formatDateBR, formatToSQLDate } from "../../utils/dateLogic";
import { supabase } from "../../lib/supabase";

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    type: string;
    image_url: string | null;
};

type CartItem = Product & { quantity: number };

type OrderAccess = {
    orderId: string;
    accessToken: string;
};

export function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Checkout Modal State
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [contactChannel, setContactChannel] = useState<"WhatsApp" | "E-mail">("WhatsApp");
    const [paymentMethod, setPaymentMethod] = useState<"PIX" | "Pagamento na Entrega">("PIX");
    const [submitting, setSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<OrderAccess | null>(null);

    const { isCurrentBatchOpen, nextDeliveryDate } = getBatchStatus();
    const formattedDeliveryDate = formatDateBR(nextDeliveryDate);

    useEffect(() => {
        async function fetchProducts() {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("is_active", true);

            if (error) {
                console.error("Error fetching products:", error);
            } else {
                setProducts(data || []);
            }
            setLoading(false);
        }

        fetchProducts();
    }, []);

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
            ).filter((item) => item.quantity > 0)
        );
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;
        setSubmitting(true);

        try {
            const deliveryDateSQL = formatToSQLDate(nextDeliveryDate);

            const { data, error: orderError } = await supabase.rpc("place_order", {
                p_customer_name: customerName,
                p_customer_email: customerEmail,
                p_customer_phone: customerPhone,
                p_contact_channel: contactChannel,
                p_delivery_date: deliveryDateSQL,
                p_payment_method: paymentMethod,
                p_items: cart.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                })),
            });

            if (orderError) throw orderError;

            const result = Array.isArray(data) ? data[0] : data;
            if (!result || typeof result.order_id !== "string" || typeof result.access_token !== "string") {
                throw new Error("The order API returned an invalid response");
            }

            setOrderSuccess({
                orderId: result.order_id,
                accessToken: result.access_token,
            });
            setCart([]);
            setIsCheckoutOpen(false);
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Houve um erro ao processar seu pedido. Tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="bg-white min-h-screen pb-24">
            {/* Banner */}
            <div className="bg-black text-white text-center py-3 px-4 font-work-sans text-sm tracking-wide">
                {isCurrentBatchOpen ? (
                    <span>Aceitando pedidos para entrega na Quarta-feira, <b>{formattedDeliveryDate}</b>.</span>
                ) : (
                    <span>Lote da semana encerrado. Aceitando pedidos para entrega na próxima Quarta-feira, <b>{formattedDeliveryDate}</b>.</span>
                )}
            </div>

            <section className="px-4 md:px-8 py-16">
                <div className="mx-auto w-full max-w-[1600px]">
                    <h1
                        className="text-center font-bold text-black tracking-tight text-4xl sm:text-5xl md:text-6xl mb-16"
                        style={{ fontFamily: "'DM Serif Text', serif" }}
                    >
                        Nossos Produtos
                    </h1>

                    {orderSuccess && (
                        <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg mb-12 text-center max-w-2xl mx-auto font-work-sans">
                            <h3 className="text-xl font-bold mb-2">Pedido Recebido com Sucesso!</h3>
                            <p>Obrigado, {customerName}. Seu pedido foi agendado para entrega em <b>{formattedDeliveryDate}</b>.</p>
                            <p className="mb-4">Guarde o link abaixo para acompanhar ou cancelar o seu pedido:</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <a
                                    href={`/pedido/${orderSuccess.orderId}#token=${encodeURIComponent(orderSuccess.accessToken)}`}
                                    className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition font-bold"
                                >
                                    Acompanhar Pedido
                                </a>
                                <button
                                    onClick={() => setOrderSuccess(null)}
                                    className="px-6 py-2 bg-green-800 text-white hover:bg-green-700 transition"
                                >
                                    Fazer novo pedido
                                </button>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-20 font-work-sans">Carregando produtos...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
                            {products.map((product) => (
                                <div key={product.id} className="flex flex-col border border-gray-200 hover:shadow-lg transition-shadow bg-white overflow-hidden group">
                                    <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden relative">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-work-sans">
                                                Sem Imagem
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex-grow">
                                            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'DM Serif Text', serif" }}>
                                                {product.name}
                                            </h3>
                                            <p className="text-gray-600 font-work-sans mb-4 min-h-[48px]">
                                                {product.description}
                                            </p>
                                            <p className="text-xl font-bold font-work-sans mb-6">
                                                R$ {product.price.toFixed(2).replace('.', ',')}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto border-t pt-4">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => removeFromCart(product.id)}
                                                    className="w-8 h-8 flex items-center justify-center border border-black hover:bg-gray-100 transition rounded-full"
                                                    disabled={!cart.find(item => item.id === product.id)}
                                                >
                                                    -
                                                </button>
                                                <span className="font-work-sans font-bold w-4 text-center">
                                                    {cart.find(item => item.id === product.id)?.quantity || 0}
                                                </span>
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    className="w-8 h-8 flex items-center justify-center border border-black hover:bg-gray-100 transition rounded-full"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Floating Cart Summary */}
            {
                cart.length > 0 && !isCheckoutOpen && !orderSuccess && (
                    <div className="fixed bottom-0 left-0 w-full bg-black text-white p-4 shadow-2xl z-40">
                        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 px-4 md:px-8 font-work-sans">
                            <div>
                                <p className="font-bold text-lg">
                                    Seu Pedido: {cart.reduce((sum, item) => sum + item.quantity, 0)} itens
                                </p>
                                <p className="text-gray-300 text-sm">
                                    Total: R$ {cartTotal.toFixed(2).replace('.', ',')}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsCheckoutOpen(true)}
                                className="bg-white text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors w-full sm:w-auto"
                            >
                                Finalizar Pedido
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Checkout Modal Overlay */}
            {
                isCheckoutOpen && (
                    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                        <div className="bg-white p-6 md:p-10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold" style={{ fontFamily: "'DM Serif Text', serif" }}>Checkout</h2>
                                <button
                                    onClick={() => setIsCheckoutOpen(false)}
                                    className="text-gray-500 hover:text-black"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mb-8 p-4 bg-gray-50 font-work-sans border border-gray-200">
                                <h3 className="font-bold mb-3 border-b pb-2">Resumo do Pedido</h3>
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm mb-2">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-bold mt-4 pt-2 border-t text-lg">
                                    <span>Total</span>
                                    <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    Entrega prevista: {formattedDeliveryDate}
                                </p>
                            </div>

                            <form onSubmit={handleCheckout} className="font-work-sans flex flex-col gap-5">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Nome Completo</label>
                                    <input
                                        type="text"
                                        required
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black"
                                        placeholder="Seu nome"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">E-mail</label>
                                    <input
                                        type="email"
                                        required
                                        value={customerEmail}
                                        onChange={e => setCustomerEmail(e.target.value)}
                                        className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black"
                                        placeholder="seu@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">WhatsApp</label>
                                    <input
                                        type="tel"
                                        required
                                        value={customerPhone}
                                        onChange={e => setCustomerPhone(e.target.value)}
                                        className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Como prefere receber atualizações?</label>
                                    <div className="flex gap-4 items-center mt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="contactChannel"
                                                value="WhatsApp"
                                                checked={contactChannel === "WhatsApp"}
                                                onChange={() => setContactChannel("WhatsApp")}
                                                className="accent-black"
                                            />
                                            WhatsApp
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="contactChannel"
                                                value="E-mail"
                                                checked={contactChannel === "E-mail"}
                                                onChange={() => setContactChannel("E-mail")}
                                                className="accent-black"
                                            />
                                            E-mail
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Método de Pagamento</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={e => setPaymentMethod(e.target.value as "PIX" | "Pagamento na Entrega")}
                                        className="w-full border border-gray-300 p-3 bg-white focus:outline-none focus:border-black"
                                    >
                                        <option value="PIX">PIX (Chave será enviada no WhatsApp)</option>
                                        <option value="Pagamento na Entrega">Pagamento na Entrega (Cartão/Dinheiro)</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest mt-4 hover:bg-gray-800 disabled:opacity-50 transition"
                                >
                                    {submitting ? 'Processando...' : 'Confirmar Pedido'}
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
        </main >
    );
}
