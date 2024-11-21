import React, { useState } from 'react';
import UserBooks from './UserBooks';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/UserInterface.css';

const booksData = [
    { id: 1, title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', category: 'Fiction', language: 'Français', available: true },
    { id: 2, title: 'Les Misérables', author: 'Victor Hugo', category: 'Classique', language: 'Français', available: false },
    { id: 3, title: 'Harry Potter', author: 'J.K. Rowling', category: 'Fantastique', language: 'Anglais', available: true },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Classique', language: 'Anglais', available: true },
    { id: 5, title: 'L\'Étranger', author: 'Albert Camus', category: 'Philosophie', language: 'Français', available: false },
    { id: 6, title: 'Don Quixote', author: 'Miguel de Cervantes', category: 'Classique', language: 'Espagnol', available: true },
    { id: 7, title: 'Moby Dick', author: 'Herman Melville', category: 'Aventure', language: 'Anglais', available: true },
    { id: 8, title: 'War and Peace', author: 'Leo Tolstoy', category: 'Historique', language: 'Russe', available: false },
    { id: 9, title: 'Les Fleurs du mal', author: 'Charles Baudelaire', category: 'Poésie', language: 'Français', available: true },
    { id: 10, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Classique', language: 'Anglais', available: true },
    { id: 11, title: 'Cien años de soledad', author: 'Gabriel García Márquez', category: 'Fantastique', language: 'Espagnol', available: false },
    { id: 12, title: 'Le Rouge et le Noir', author: 'Stendhal', category: 'Romance', language: 'Français', available: true },
    { id: 13, title: 'The Catcher in the Rye', author: 'J.D. Salinger', category: 'Fiction', language: 'Anglais', available: true },
    { id: 14, title: 'Le Comte de Monte-Cristo', author: 'Alexandre Dumas', category: 'Aventure', language: 'Français', available: false },
    { id: 15, title: 'Jane Eyre', author: 'Charlotte Brontë', category: 'Romance', language: 'Anglais', available: true },
    { id: 16, title: 'Anna Karenina', author: 'Leo Tolstoy', category: 'Classique', language: 'Russe', available: true },
    { id: 17, title: 'Madame Bovary', author: 'Gustave Flaubert', category: 'Fiction', language: 'Français', available: false },
    { id: 18, title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', category: 'Philosophie', language: 'Russe', available: true },
    { id: 19, title: 'Les Contemplations', author: 'Victor Hugo', category: 'Poésie', language: 'Français', available: true },
    { id: 20, title: 'The Odyssey', author: 'Homer', category: 'Épopée', language: 'Grec ancien', available: false },
];

const categories = ['Fiction', 'Classique', 'Fantastique', 'Philosophie', 'Aventure', 'Historique', 'Poésie'];
const languages = ['Français', 'Anglais', 'Espagnol', 'Russe', 'Grec ancien'];

const UserInterface = () => {
    const [view, setView] = useState('catalogue');
    const [filters, setFilters] = useState({
        keywords: '',
        availableOnly: false,
        category: '',
        language: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const handleAvailabilityChange = () => {
        setFilters((prevFilters) => ({ ...prevFilters, availableOnly: !prevFilters.availableOnly }));
    };

    const handleKeywordChange = (event) => {
        setFilters((prevFilters) => ({ ...prevFilters, keywords: event.target.value }));
    };

    const handleFilterChange = (filterType, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: value
        }));
    };

    const filteredBooks = booksData.filter((book) => {
        const matchesAvailability = !filters.availableOnly || book.available;
        const matchesKeywords = filters.keywords === '' || book.title.toLowerCase().includes(filters.keywords.toLowerCase()) || book.author.toLowerCase().includes(filters.keywords.toLowerCase());
        const matchesCategory = filters.category === '' || book.category === filters.category;
        const matchesLanguage = filters.language === '' || book.language === filters.language;
        return matchesAvailability && matchesKeywords && matchesCategory && matchesLanguage;
    });

    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container user-interface">
        

            {view === 'catalogue' && (
                <>
                    <div className="row">
                        <div className="col-md-3">
                            {/* Filtres */}
                            <div className="filter-section p-3 border rounded">
                                <h5>Filtres</h5>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Mots clés"
                                    value={filters.keywords}
                                    onChange={handleKeywordChange}
                                />
                                <div className="form-check mb-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={filters.availableOnly}
                                        onChange={handleAvailabilityChange}
                                    />
                                    <label className="form-check-label">Exemplaire disponible</label>
                                </div>
                                <select
                                    className="form-control mb-3"
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                >
                                    <option value="">Toutes les catégories</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <select
                                    className="form-control mb-3"
                                    value={filters.language}
                                    onChange={(e) => handleFilterChange('language', e.target.value)}
                                >
                                    <option value="">Toutes les langues</option>
                                    {languages.map((lang) => (
                                        <option key={lang} value={lang}>{lang}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <UserBooks booksData={currentBooks} />
                            <nav className="mt-4">
                                <ul className="pagination justify-content-center">
                                    {[...Array(totalPages).keys()].map((number) => (
                                        <li
                                            key={number}
                                            className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}
                                            onClick={() => handlePageChange(number + 1)}
                                        >
                                            <span className="page-link">{number + 1}</span>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserInterface;
